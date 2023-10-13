import { format, compareAsc } from 'date-fns';
import { renderNav } from './modules/nav';
import { renderTasks, renderTask } from './modules/main-content';
import{ setAttributes, camelize } from './modules/helpers.js';
import appState from './modules/app-state';
import Task from './modules/factories/task';

// console.log(appState.getFolders()[0].getProjects()[0].getTasks()[0].getName());

// need to know which property to pull from item, what the value should match
const filters = {
  all: {
    func: 'getCompletionStatus',
    value: false
  },
  today: {
    func: 'getDueDate',
    value: format(new Date(), 'MM/dd/yyyy')
  },
};

// cache DOM
const addItem = document.querySelector('.add-item');
const modalMenu = document.querySelector('#modal-menu');
const modalOptions = document.querySelectorAll('#modal-menu > p');
const modalBackdrop = document.querySelector('#modal-backdrop');
const modalForms = document.querySelectorAll('.modal-form');
const [taskForm, projectForm, folderForm] = modalForms;
const taskProjectDropdown = taskForm.querySelector('#task-project');
const projectFolderDropdown = projectForm.querySelector('#project-folder');
// console.dir(taskForm);

// add event listeners
document.addEventListener('DOMContentLoaded', renderPage);
addItem.addEventListener('click', toggleModalMenu);
document.addEventListener('click', hideModalMenu);
modalOptions.forEach(option => option.addEventListener('click', showModal));
modalBackdrop.addEventListener('click', hideModal);
taskForm.addEventListener('submit', createTask);

function renderPage() {
  console.log("DOM fully loaded and parsed");

  renderTasks();
  renderNav();
  renderModalDropdown();
}

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
    .filter(form => form.id === modals[e.target.innerText])[0];
  console.log(correctForm);
  correctForm.classList.remove('hidden');
}

// hides modal backdrop and modal dialogues
function hideModal(e) {
  if (e.target.id === 'modal-backdrop' ||
      e.target.classList.contains('cancel') ||
      e.type === 'submit') {
    modalBackdrop.classList.add('hidden');
    modalForms.forEach(form => form.classList.add('hidden'));
  }
}

// create new Task instance from form submission
function createTask(e) {
  e.preventDefault();
  // extract values from form
  const formValues = getFormValues(e.target);
  // console.log(formValues);

  // create Task obj
  const newTask = Task(formValues.name, formValues.dueDate, formValues.priority, formValues.notes);
  // push Task to parentProject task array
  let parentProject;
  appState.getFolders().forEach(folder => {
    const correctProject = folder.getProjects().filter(project => project.getId() === formValues.project);
    if (correctProject.length > 0) parentProject = correctProject[0];
  });
  parentProject.addTask(newTask);

  // render task if on correct page
  if (newTask[filters[appState.getCurrentFilter()].func]() === filters[appState.getCurrentFilter()].value) {
    const ul = document.querySelector(`.${appState.getCurrentFilter()}`);
    console.log(ul);
    ul.appendChild(renderTask(newTask));
  }

  // hideModal(e);
  // e.target.reset();
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

export { filters };