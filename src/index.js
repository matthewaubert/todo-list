import appState from './modules/app-state';
import { camelize } from './modules/helpers';
import Task from './modules/factories/task';
import Project from './modules/factories/project';
import Folder from './modules/factories/folder';
import renderController from './modules/render-controller';

// console.log(appState.getTasks()[0].getName());

// cache DOM
const nav = document.querySelector('#nav');
const navArrows = document.querySelectorAll('.nav-arrow');
const navFilters = nav.querySelectorAll('li');
const addItem = document.querySelector('.add-item');
const modalMenu = document.querySelector('#modal-menu');
const modalOptions = document.querySelectorAll('#modal-menu > p');
const modalBackdrop = document.querySelector('#modal-backdrop');
const modalForms = document.querySelectorAll('.modal-form');

// add event listeners
document.addEventListener('DOMContentLoaded', renderController.renderPage);
navArrows.forEach(navArrow => navArrow.addEventListener('click', toggleNav));
navFilters.forEach(navFilter => navFilter.addEventListener('click', loadFilter));
addItem.addEventListener('click', toggleModalMenu);
document.addEventListener('click', hideModalMenu);
modalOptions.forEach(option => option.addEventListener('click', showModal));
modalBackdrop.addEventListener('click', hideModal);
modalForms.forEach(form => form.addEventListener('submit', handleFormSubmission));


/* NAV FUNCTIONALITY */

function toggleNav() {
  nav.classList.toggle('hidden');
  navArrows.forEach(navArrow => navArrow.classList.toggle('rotated'));
}

function loadFilter(e) {
  renderController.clearTasks(); // clear tasks
  // DELETE CHECKED TASKS

  appState.currentFilter = e.target.dataset.name; // change appState.currentFilter
  renderController.renderTasks(e.target.dataset); // renderController.render tasks according to filter

  toggleNav(); // hide nav
}


/* MODAL FUNCTIONALITY */

// toggles menu with 3 options: create task, create project, create folder
function toggleModalMenu() {
  addItem.classList.toggle('rotated'); // rotate addItem button 45deg
  modalMenu.classList.toggle('hidden'); // toggle modal menu
}

function hideModalMenu(e) {
  if (e.target !== addItem) {
    addItem.classList.remove('rotated');
    modalMenu.classList.add('hidden');
  }
}

// shows modal backdrop, modal dialogue depending which was selected in modal menu
function showModal(e) {
  modalBackdrop.classList.remove('hidden');

  // relate menu button clicked with form to open
  const modals = {
    'Create Task': 'task-form',
    'Create Project': 'project-form',
    'Create Folder': 'folder-form',
  };

  // filter thru modal forms for matching id
  const correctForm = Array.from(modalForms)
    .find(form => form.id === modals[e.target.innerText]);
  // console.log(correctForm);
  correctForm.classList.remove('hidden');
}

// hides modal backdrop and modal dialogues
function hideModal(e) {
  if (e.target.id === 'modal-backdrop' ||
      e.target.classList.contains('cancel') ||
      e.type === 'submit') {
    modalBackdrop.classList.add('hidden');
    modalForms.forEach(form => {
      form.classList.add('hidden');
      form.reset();
    });
    // console.log(e.target);
  }
}

// extract form values to create correct item, hide modal, reset form
function handleFormSubmission(e) {
  e.preventDefault();
  const formValues = getFormValues(e.target); // extract values from form
  console.log(formValues);

  switch(e.target.id) {
    case 'task-form':
      createTask(formValues);
      break;
    case 'project-form':
      createProject(formValues);
      break;
    case 'folder-form':
      createFolder(formValues);
      break;
  }

  hideModal(e);
}

// extract field values from form submission; return values as obj
function getFormValues(formValues) {
  return Object.values(formValues).reduce((obj, field) => {
    // if not a button
    if (field.tagName !== 'BUTTON') {
      if (field.type === 'radio') {
        if (field.checked) obj[field.name] = field.value;
      } else {
        obj[camelize(field.name)] = field.value;
      }
    }
    return obj;
  }, {});
}

// create new Task instance from form submission
function createTask(formValues) {
  const newTask = Task(formValues.name, formValues.dueDate, formValues.priority, formValues.notes);
  // push Task to parentProject tasks array
  const parentProject = appState.getProjectById(formValues.project);
  if (parentProject) parentProject.addTask(newTask);
  // console.log(appState.getTasks());

  const ul = document.querySelector(`ul[data-name=${appState.currentFilter}]`);
  // renderController.render task if on correct page
  switch(appState.currentFilter) {
    case 'folder':
      const parentFolder = appState.getProjectParent(parentProject);
      if (ul.dataset.id === parentFolder.getId()) {
        ul.appendChild(renderController.renderTask(newTask));
      }
      break;
    case 'project':
      if (ul.dataset.id === parentProject.getId()) {
        ul.appendChild(renderController.renderTask(newTask));
      }
      break;
    default:
      if (appState.filters[appState.currentFilter](newTask)) {
        ul.appendChild(renderController.renderTask(newTask));
      }
  }
}

// create new Project instance from form submission
function createProject(formValues) {
  const newProject = Project(formValues.name, formValues.notes);
  // push Project to parentFolder projects array
  let parentFolder = appState.getFolderById(formValues.folder);
  if (parentFolder) parentFolder.addProject(newProject);
  // console.log(appState.getProjects());

  // renderController.render project in sidebar
  const ul = document.querySelector(`[class="folder-nav"][data-id="${parentFolder.getId()}"]`);
  ul.appendChild(renderController.renderNavItem(newProject, 'project'));

  renderController.taskProjectDropdown.appendChild(createDropdownOption(newProject)); // create dropdown option
}

// create new Folder instance from form submission
function createFolder(formValues) {
  const newFolder = Folder(formValues.name);
  appState.addFolder(newFolder); // push Folder to appState folders array
  // console.log(appState.getFolders());

  nav.appendChild(renderController.renderNavFolder(newFolder)); // renderController.render folder in sidebar

  renderController.projectFolderDropdown.appendChild(createDropdownOption(newFolder)); // create dropdown option
}


export { loadFilter }