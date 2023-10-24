import { format, parse } from 'date-fns';
import appState from './app-state.js';
import { loadFilter, showModal, deleteItem, toggleCompleted } from '../index.js'
import { createSvg, setAttributes } from './helpers.js';

// exports object which controls any rendering to DOM
export default (function() {
  
  // cache DOM
  const main = document.querySelector('#main');
  const nav = document.querySelector('#nav');
  const h1 = document.querySelector('h1');
  const dropdowns = {
    project: document.querySelectorAll('.task-project'),
    folder: document.querySelectorAll('.project-folder'),
  }
  
  // render tasks, modal dropdowns, nav upon app initialization
  function renderPage() {
    renderTasks();
    renderModalDropdown();
    renderNav();
  }


  /* ITEM RENDERING LOGIC */

  // object to hold logic for rendering elements to the DOM upon Item instance creation
  const renderItem = {
    // logic to render elements to the DOM upon Task instance creation
    task: task => {
      const ul = document.querySelector(`ul[data-name=${appState.getCurrentFilter()}]`);
      const parentProject = appState.getProjectById(task.getProject());
      // render task if on correct page (i.e. passes filters)
      switch(appState.getCurrentFilter()) {
        case 'project': // if project filter, check for matching id
          if (ul.dataset.id === parentProject.getId()) {
            ul.appendChild(renderTask(task));
          }
          break;
        case 'folder': // if folder filter, check for matching id
          const parentFolder = appState.getFolderById(parentProject.getFolder());
          if (ul.dataset.id === parentFolder.getId()) {
            ul.appendChild(renderTask(task));
          }
          break;
        default: // all other filters, check if task passes filter
          if (appState.getFilters()[appState.getCurrentFilter()](task)) {
            ul.appendChild(renderTask(task));
          }
      }
    },
    // logic to render elements to the DOM upon Project instance creation
    project: project => {
      // render project in sidebar
      const ul = document.querySelector(`[class="folder-nav"][data-id="${project.getFolder()}"]`);
      ul.appendChild(renderNavItem(project, 'project'));
    
      renderDropdownOptions(project); // render dropdown option
    },
    // logic to render elements to the DOM upon Folder instance creation
    folder: folder => {
      nav.appendChild(renderNavFolder(folder)); // render folder in sidebar

      renderDropdownOptions(folder); // render dropdown option
    }
  }

  // remove all renderings of Item instance in DOM
  function removeItem(itemId) {
    const elements = document.querySelectorAll(`[data-id=${itemId}]`);
    elements.forEach(el => el.remove());
  }


  /* TASK RENDERING FUNCTIONALITY */

  // render all tasks; optional input: dataset (acts as a filter)
  function renderTasks(dataset) {
    const allTasks = [];

    // if there's a dataset, get tasks that pass filter
    if (dataset) {
      // filter by project
      switch(dataset.name) {
        case 'project':
          const project = appState.getProjectById(dataset.id);
          allTasks.push(...project.getTasks());
          break;
        // filter by folder
        case 'folder':
          const folder = appState.getFolderById(dataset.id);
          folder.getProjects().forEach(project => allTasks.push(...project.getTasks()));
          break;
        // all other filters
        default:
          allTasks.push(...appState.getTasks(appState.getCurrentFilter()));
          break;
      }
    // if no filter, get all tasks
    } else {
      allTasks.push(...appState.getTasks());
    }
    
    // create ul and set data attributes
    const ul = document.createElement('ul');
    ul.dataset.name = appState.getCurrentFilter();
    if (dataset && dataset.hasOwnProperty('id')) ul.dataset.id = dataset.id;
    
    allTasks.forEach(task => ul.appendChild(renderTask(task)));
    main.appendChild(ul);
  }

  // create and return an li containing a checkbox, label, date div,
  // priority flag, and edit icon relating to the input task
  function renderTask(task) {
    // create checkbox
    const checkbox = document.createElement('input');
    setAttributes(checkbox, {
      'type': 'checkbox',
      'id': task.getId()
    });
    checkbox.addEventListener('change', toggleCompleted);
    
    // create label
    const label = document.createElement('label');
    label.setAttribute('for', task.getId());
    label.innerText = task.getName();

    // create date div
    const date = document.createElement('p');
    date.classList.add('date');
    date.innerText = format(
      parse(task.getDueDate(), 'yyyy-MM-dd', new Date()),
      'PP'
    );

    // create svg icons
    const svg = {
      edit: createSvg('0 0 24 24', 'M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z'),
      flag: createSvg('0 0 24 24', 'M6,3A1,1 0 0,1 7,4V4.88C8.06,4.44 9.5,4 11,4C14,4 14,6 16,6C19,6 20,4 20,4V12C20,12 19,14 16,14C13,14 13,12 11,12C8,12 7,14 7,14V21H5V4A1,1 0 0,1 6,3Z')
    };
    svg.flag.classList.add(`priority${task.getPriority()}`);
    svg.edit.dataset.for = 'edit-task-form';
    svg.edit.addEventListener('click', showModal);

    // create wrapper li, add data, append child elements
    const li = document.createElement('li');
    li.classList.add('task-main');
    li.dataset.id = task.getId();
    li.append(checkbox, label, date, svg.flag, svg.edit);

    // if task is completed, mark appropriately
    if (task.getCompletionStatus()) {
      li.classList.add('completed');
      checkbox.checked = true;
    }

    return li;
  }

  // remove all children of #main
  function clearTasks() {
    while (main.lastElementChild) {
      main.removeChild(main.lastElementChild);
    }
  }


  /* MODAL RENDERING FUNCTIONALITY */

  // render all folders and projects to relevant modal <select> fields
  function renderModalDropdown() {
    // render dropdown option for each folder
    appState.getFolders().forEach(folder => {
      renderDropdownOptions(folder);
      // render dropdown option for each project
      folder.getProjects().forEach(project => {
        renderDropdownOptions(project);
      });
    });
  }

  // render item to relevant modal <select> fields
  function renderDropdownOptions(item) {
    dropdowns[item.getItemType()].forEach(dropdown => {
      dropdown.appendChild(renderDropdownOption(item))
    });
  }

  // create and return an <option> element for item
  function renderDropdownOption(item) {
    const option = document.createElement('option');

    setAttributes(option, {
      'value': item.getId(),
      'data-id': item.getId(),
    });
    option.textContent = item.getName();
    if (option.textContent === 'First Project' || option.textContent === 'First Folder') {
      option.setAttribute('selected', true);
    }
    
    return option;
  }


  /* NAV RENDERING FUNCTIONALITY */

  // render all folders and projects to nav
  function renderNav() {
    // for each folder, create ul and li
    appState.getFolders().forEach(folder => {
      const ul = renderNavFolder(folder);
      // for each project, create li
      folder.getProjects().forEach(project => ul.appendChild(renderNavItem(project, 'project')));
      nav.appendChild(ul);
    });
  }

  // create and return nav ul with 1 li for folder
  function renderNavFolder(folder) {
    const ul = document.createElement('ul');
    ul.classList.add('folder-nav');
    ul.dataset.id = folder.getId();

    ul.appendChild(renderNavItem(folder, 'folder'));

    return ul;
  }

  // create and return nav li for folder or project
  function renderNavItem(item, type) {
    // create folder svg
    const svg = {
      folder: createSvg('0 0 24 24', 'M20,18H4V8H20M20,6H12L10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6Z'),
      project: createSvg('0 0 24 24', 'M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z'),
      edit: createSvg('0 0 24 24', 'M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z'),
      trash: createSvg('0 0 24 24', 'M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z')
    };

    // create text
    const p = document.createElement('p');
    p.innerText = item.getName();

    // add data and event listener to edit svg
    svg.edit.dataset.for = `edit-${type}-form`;
    svg.edit.addEventListener('click', showModal);

    // add data and event listener to trash svg
    svg.trash.dataset.for = 'edit-trash';
    svg.trash.addEventListener('click', deleteItem[type]);

    // create wrapper li, add data, add event listener, append child elements
    const li = document.createElement('li');
    li.classList.add(`${type}-nav`);
    li.dataset.id = item.getId();
    li.dataset.name = type;
    li.addEventListener('click', loadFilter);
    li.append(svg[type], p, svg.edit, svg.trash);
    
    return li;
  }

  // render header based on selected nav filter
  function renderHeader(selectedFilter) {
    if (appState.getCurrentFilter() === 'all') {
      h1.innerText = 'All ';
      const span = document.createElement('span');
      span.innerText = 'Tasks';
      h1.appendChild(span);
    } else {
      h1.innerText = selectedFilter.innerText;
    }
  }


  return { renderPage, renderItem, removeItem, renderTasks, clearTasks, renderHeader };

})();