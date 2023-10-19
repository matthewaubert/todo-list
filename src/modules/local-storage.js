import appState from './app-state';
import Folder from './classes/folder';
import Project from './classes/project';
import Task from './classes/task';

// check if storage is available; return boolean value
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

// get folders from appState, store as JSON in localStorage
function serializeItems() {
  const folders = {};
  // store appState folders as key-value pairs in folders obj
  appState.getFolders().forEach(folder => folders[folder.getId()] = folder);
  localStorage.setItem("appStateFolders", serialize(folders)); // store serialized folders obj in localStorage

  console.log('serialized!');
}

// translate object to JSON
function serialize(obj) {
  return JSON.stringify(obj);
}

// get folders form localStorage, deserialize, add to appState
function deserializeItems() {
  let folders = localStorage.getItem("appStateFolders");
  folders = deserialize(folders);
  // append folders to appState
  for (const key in folders) {
    appState.addFolder(folders[key]);
  }

  console.log('deserialized!');
}

// translate JSON back to JavaScript object
function deserialize(serializedObj) {
  const parsedObj = JSON.parse(serializedObj); // parse serializedObj
  setChildrenPrototype(parsedObj); // set prototype of child items

  return parsedObj;
}

// set prototype of child items
function setChildrenPrototype(item) {
  if (item instanceof Project) {
    // set prototype of each task
    item.getTasks().forEach(task => {
      Object.setPrototypeOf(task, Task.prototype);
    });
  } else if (item instanceof Folder) {
    // set prototype of each project
    item.getProjects().forEach(project => {
      Object.setPrototypeOf(project, Project.prototype);
      setChildrenPrototype(project);
    });
  } else {
    // set prototype of each folder
    for (const key in item) {
      const folder = item[key];
      Object.setPrototypeOf(folder, Folder.prototype);
      setChildrenPrototype(folder);
    }
  }
}

export { storageAvailable, serializeItems, deserializeItems };