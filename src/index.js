import { format, compareAsc } from 'date-fns';
import { renderNav } from './modules/nav';
import { renderTasks } from './modules/main-content';
import initAppState from './modules/app-state';

// load initial app state with 1 default folder, project, task
const appState = initAppState();
// console.log(appState.getFolders()[0].getProjects()[0].getTasks()[0].getName());

// cache DOM
const addItem = document.querySelector('.add-item');
const modalMenu = document.querySelector('#modal-menu');
const modalOptions = document.querySelectorAll('#modal-menu > p');
const modalBackdrop = document.querySelector('#modal-backdrop');
const modalForms = document.querySelectorAll('.modal-form');
// const cancels = document.querySelectorAll('.cancel');

// add event listeners
document.addEventListener('DOMContentLoaded', renderPage);
addItem.addEventListener('click', toggleModalMenu);
document.addEventListener('click', hideModalMenu);
modalOptions.forEach(option => option.addEventListener('click', showModal));
modalBackdrop.addEventListener('click', hideModal);

function renderPage() {
  console.log("DOM fully loaded and parsed");

  renderTasks();
  renderNav();
}

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

function showModal(e) {
  modalBackdrop.classList.remove('hidden');

  // relate menu button clicked with form to open
  const modals = {
    'Add Task': 'task-form',
    'Add Project': 'project-form',
    'Add Folder': 'folder-form',
  };

  // filter thru modal forms for matching id
  const correctForm = Array.from(modalForms).filter(form => form.id === modals[e.target.innerText])[0];
  console.log(correctForm);
  correctForm.classList.remove('hidden');
}

function hideModal() {
  modalBackdrop.classList.add('hidden');
  modalForms.forEach(form => form.classList.add('hidden'));
}

export { appState };