import appState from './app-state';
import { filters } from '../index';
import { setAttributes } from './helpers';

// cache DOM
const main = document.querySelector('#main');
const nav = document.querySelector('#nav');
const taskProjectDropdown = document.querySelector('#task-project');
const projectFolderDropdown = document.querySelector('#project-folder');

// initial page render
function renderPage() {
  console.log("DOM fully loaded and parsed");

  renderTasks();
  renderModalDropdown();
  renderNav();
}


/* TASK RENDERING FUNCTIONALITY */

// initial rendering of tasks
function renderTasks(currentFilter) {
  const allTasks = [];

  appState.getFolders().forEach(folder => {
    folder.getProjects().forEach(project => {
      if (currentFilter) {
        allTasks.push(...project.getTasks()
          .filter(task => task[filters[currentFilter].func]() === filters[currentFilter].value));
      } else {
        allTasks.push(...project.getTasks());
      }
    });
  });

  const ul = document.createElement('ul');
  ul.classList.add(appState.getCurrentFilter());

  // console.log(allTasks[0].getName());
  allTasks.forEach(task => ul.appendChild(renderTask(task)));
  main.appendChild(ul);
}

// return a div containing a checkbox and label relating to the input task
function renderTask(task) {
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
  
  // append checkbox and label to wrapper li
  const li = document.createElement('li');
  li.classList.add('task-main');
  li.dataset.id = task.getId();
  li.append(check, label);

  return li;
}

// toggle completion status of task, gray out HTML el
function toggleCompleted(e) {
  // console.log(e.target.id);

  appState.getFolders().forEach(folder => {
    folder.getProjects().forEach(project => {
      const targetTask = project.getTasks().filter(task => task.getId() === e.target.id)[0];
      targetTask.toggleCompleted();
      // console.log(targetTask.getCompletionStatus());
    });
  });

  e.target.parentNode.classList.toggle('completed');
}


/* MODAL RENDERING FUNCTIONALITY */

// initial rendering of folders and projects to modal dropdown menu
function renderModalDropdown() {
  const folders = appState.getFolders(); // get folders
  // render folders to modalDropdown
  folders.forEach(folder => projectFolderDropdown.appendChild(createDropdownOption(folder)));

  // get projects
  const projects = [];
  folders.forEach(folder => projects.push(...folder.getProjects()));
  // render dropdown option for each project and append to taskProjectDropdown
  projects.forEach(project => taskProjectDropdown.appendChild(createDropdownOption(project)));
}

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
  const folders = appState.getFolders();
  folders.forEach(folder => {
    const ul = renderNavFolder(folder);
    
    // for each project, create li
    const projects = folder.getProjects();
    projects.forEach(project => ul.appendChild(renderNavProject(project)));

    nav.appendChild(ul);
  });
}

function renderNavFolder(folder) {
  const ul = document.createElement('ul');
  ul.classList.add('folder-nav');
  ul.dataset.id = folder.getId();

  const li = document.createElement('li');
  li.classList.add('folder-nav');
  li.innerText = folder.getName();
  ul.appendChild(li);

  return ul;
}

function renderNavProject(project) {
  const li = document.createElement('li');
  li.classList.add('project-nav');
  li.dataset.id = project.getId();
  li.innerText = project.getName();
  
  return li;
}


export { nav, taskProjectDropdown, projectFolderDropdown, renderPage, renderTask, renderNavProject, renderNavFolder, createDropdownOption };