import appState from './app-state';
import Folder from './classes/folder';
import Project from './classes/project';
import Task from './classes/task';

if (localStorage.length === 0) {
  // serializeItems();
} else {
  // deserializeItems();
}

function serializeItems() {
  const folders = appState.getFolders(); // get folders from appState
  // store folders in localStorage
  folders.forEach(folder => {
    localStorage.setItem(folder.getId(), serialize(folder));
  });
}

function deserializeItems() {
  // grab folders from local storage
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      // deserialize folders
      const folder = deserialize(localStorage[key], Folder);
      appState.addFolder(); // add folder to appState
    }
  }
}

function serialize(obj) {
  return JSON.stringify(obj);
}

function deserialize(serializedObj, Class) {
  // parse serializedObj
  const parsedObj = JSON.parse(serializedObj);
  // set prototype of parsedObj
  Object.setPrototypeOf(parsedObj, Class.prototype);
  // set prototype of child items
  setChildrenPrototype(parsedObj);

  return parsedObj;
}

function setChildrenPrototype(item) {
  if (item instanceof Folder) {
    // set prototype of each project
    item.getProjects().forEach(project => {
      Object.setPrototypeOf(project, Project.prototype);
      setChildrenPrototype(project);
    });
  } else if (item instanceof Project) {
    // set prototype of each item
    item.getTasks().forEach(task => {
      Object.setPrototypeOf(task, Task.prototype);
    });
  }
}

export { serializeItems, deserializeItems };