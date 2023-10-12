import './style.css';
import { format, compareAsc } from 'date-fns';
import { renderNav } from './modules/nav';
import { renderTasks } from './modules/main-content';
import initAppState from './modules/app-state';

// load initial app state with 1 default folder, project, task
const appState = initAppState();
// console.log(appState.getFolders()[0].getProjects()[0].getTasks()[0].getName());

// cache DOM

// add event listeners
document.addEventListener('DOMContentLoaded', renderPage);

function renderPage() {
  console.log("DOM fully loaded and parsed");

  renderTasks();
  renderNav();
}

export { appState };