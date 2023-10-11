import { compGetItems, compAddItem, compDeleteItem } from './factories/composition';
import Folder from './factories/folder';
import Project from './factories/project';

// create AppState object: contains an array of folders and related methods
function AppState() {
  const state = {
    folders: [] // array of Folder object instances
  }

  return Object.assign(
    {},
    compGetItems(state, 'folder'),
    compAddItem(state, 'folder'),
    compDeleteItem(state, 'folder')
  );
}

// export AppState instance with one default folder and project
export default function initAppState() {
  const appState = AppState();
  
  const firstFolder = Folder('First Folder', 'Default first folder');
  appState.addFolder(firstFolder);
  
  const firstProject = Project('First Project', 'Default first project');
  firstFolder.addProject(firstProject);

  return appState;
}