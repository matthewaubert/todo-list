import appState from './app-state';

// cache DOM
const nav = document.querySelector('#nav');

// render nav
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

export { renderNav };