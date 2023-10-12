import './style.css';
import { format, compareAsc } from 'date-fns';
import { renderNav } from './modules/nav';
import { renderTasks } from './modules/main-content';
import initAppState from './modules/app-state';

// load initial app state with 1 default folder, project, task
const appState = initAppState();
// console.log(appState.getFolders()[0].getProjects()[0].getTasks()[0].getName());

// cache DOM
const addItem = document.querySelector('.add-item');
const modalMenu = document.querySelector('#modal-menu')
const dialog = document.querySelector('.dialog');
const cancels = document.querySelectorAll('.cancel');

// add event listeners
document.addEventListener('DOMContentLoaded', renderPage);
addItem.addEventListener('click', toggleModalMenu);
document.addEventListener('click', hideModalMenu);

function renderPage() {
  console.log("DOM fully loaded and parsed");

  renderTasks();
  renderNav();
}

function toggleModalMenu() {
  addItem.classList.toggle('rotated'); // rotate addItem button 45deg
  modalMenu.classList.toggle('hidden'); // toggle options menu
}

function hideModalMenu(e) {
  if (e.target !== addItem) {
    addItem.classList.remove('rotated');
    modalMenu.classList.add('hidden');
  }
}

// function showModal() {
//   const modals = {
//     'Add Task': ,
//     'Add Project': ,
//     'Add Folder': ,
//   };

// }

export { appState };