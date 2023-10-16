import appState from './app-state';
import { loadFilter, showModal } from '../index'
import { createSvg, setAttributes } from './helpers';

export default (function() {
  
  // cache DOM
  const main = document.querySelector('#main');
  const nav = document.querySelector('#nav');
  const taskProjectDropdowns = document.querySelectorAll('.task-project');
  const projectFolderDropdowns = document.querySelectorAll('.project-folder');
  
  // initial page render
  function renderPage() {
    console.log("DOM fully loaded and parsed");

    renderTasks();
    renderModalDropdown();
    renderNav();
  }


  /* TASK RENDERING FUNCTIONALITY */

  // initial rendering of tasks
  function renderTasks(dataset) {
    const allTasks = [];

    // if want to filter which projects to render
    if (dataset) {
      switch(dataset.name) {
        case 'project':
          const project = appState.getProjectById(dataset.id);
          allTasks.push(...project.getTasks());
          break;
        case 'folder':
          const folder = appState.getFolderById(dataset.id);
          folder.getProjects().forEach(project => allTasks.push(...project.getTasks()));
          break;
        default:
          allTasks.push(...appState.getTasks(appState.currentFilter, dataset.name));
          break;
      }
    } else {
      allTasks.push(...appState.getTasks());
    }
    // console.log(allTasks);
    
    const ul = document.createElement('ul');
    ul.dataset.name = appState.currentFilter;
    if (dataset && dataset.hasOwnProperty('id')) ul.dataset.id = dataset.id;
    
    // console.log(allTasks[0].getName());
    allTasks.forEach(task => ul.appendChild(renderTask(task)));
    main.appendChild(ul);
  }

  // return a div containing a checkbox and label relating to the input task
  function renderTask(task) {
    console.log(`current task: ${task.getId()}`);
    // create checkbox
    const check = document.createElement('input');
    setAttributes(check, {
      'type': 'checkbox',
      'id': task.getId()
    });
    check.addEventListener('change', toggleCompleted);
    
    // create label
    const label = document.createElement('label');
    label.setAttribute('for', task.getId());
    label.innerText = task.getName();

    // create edit svg
    const svg = createSvg('0 0 24 24', 'M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z');
    svg.dataset.for = 'edit-task-form';
    svg.addEventListener('click', showModal);

    // append checkbox and label to wrapper li
    const li = document.createElement('li');
    li.classList.add('task-main');
    li.dataset.id = task.getId();
    li.append(check, label, svg);

    return li;
  }

  // remove all children of #main
  function clearTasks() {
    while (main.lastElementChild) {
      main.removeChild(main.lastElementChild);
    }
  }

  // toggle completion status of task, gray out HTML el
  function toggleCompleted(e) {
    console.log(e.target.id);

    const targetTask = appState.getTaskById(e.target.id);
    if (targetTask) targetTask.toggleCompleted();

    e.target.parentNode.classList.toggle('completed');
  }


  /* MODAL RENDERING FUNCTIONALITY */

  // initial rendering of folders and projects to modal dropdown menu
  function renderModalDropdown() {
    // render folders to modalDropdowns
    appState.getFolders().forEach(folder => {
      projectFolderDropdowns.forEach(dropdown => dropdown.appendChild(createDropdownOption(folder)));
    });

    // render dropdown option for each project and append to taskProjectDropdowns
    appState.getProjects().forEach(project => {
      taskProjectDropdowns.forEach(dropdown => dropdown.appendChild(createDropdownOption(project)));
    });
  }

  // creates an option element in the modal menu for a project or folder 
  function createDropdownOption(item) {
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

  // initial nav render
  function renderNav() {
    // for each folder, create ul and li
    appState.getFolders().forEach(folder => {
      const ul = renderNavFolder(folder);
      // for each project, create li
      folder.getProjects().forEach(project => ul.appendChild(renderNavItem(project, 'project')));
      nav.appendChild(ul);
    });
  }

  // render nav ul with 1 li for folder
  function renderNavFolder(folder) {
    const ul = document.createElement('ul');
    ul.classList.add('folder-nav');
    ul.dataset.id = folder.getId();

    ul.appendChild(renderNavItem(folder, 'folder'));

    return ul;
  }

  // render nav li for folder or project
  function renderNavItem(item, type) {
    const li = document.createElement('li');
    li.classList.add(`${type}-nav`);
    li.dataset.id = item.getId();
    li.dataset.name = type;
    li.innerText = item.getName();
    li.addEventListener('click', loadFilter);
    
    return li;
  }

  return { renderPage, renderTasks, renderTask, clearTasks, renderNavItem, renderNavFolder, createDropdownOption, taskProjectDropdowns, projectFolderDropdowns };

})();