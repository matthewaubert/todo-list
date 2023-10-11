import { createHeader, createParagraph, assemble } from './modules/helpers';
import './style.css';
import initAppState from './modules/app-state';

// load initial app state with 1 default folder and project
const appState = initAppState();

// cache DOM
const nav = document.querySelector('#nav');

// add event listeners
document.addEventListener('DOMContentLoaded', loadSidebar);

// load sidebar
function loadSidebar() {
  console.log("DOM fully loaded and parsed");

  // for each folder, create ul and li
  const folders = appState.getFolders();
  folders.forEach(folder => {
    const ul = document.createElement('ul');
    ul.classList.add('folder-sidebar');
    ul.dataset.id = folder.getId();

    const li = document.createElement('li');
    li.classList.add('folder-sidebar');
    li.innerText = folder.getName();
    ul.appendChild(li);
    // for each project, create li
    const projects = folder.getProjects();
    projects.forEach(project => {
      const li = document.createElement('li');
      li.classList.add('project-name-sidebar');
      li.dataset.id = project.getId();
      li.innerText = project.getName();
      ul.appendChild(li);
    });

    nav.appendChild(ul);
  });
}

// media query: show arrow at top of main content if screen under 500px wide

// show main content if nav element clicked