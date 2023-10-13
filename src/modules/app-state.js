import { format, compareAsc } from 'date-fns'
import { compGetItems, compAddItem, compDeleteItem } from './factories/composition';
import Folder from './factories/folder';
import Project from './factories/project';
import Task from './factories/task';

const compGetCurrentFilter = state => ({
  getCurrentFilter: () => state.currentFilter
});
const compSetCurrentFilter = state => ({
  compSetCurrentFilter: newPage => state.currentFilter = newPage
});

// create AppState object: contains an array of folders and related methods
function AppState() {
  const state = {
    folders: [], // array of Folder object instances
    currentFilter: 'all'
  }

  return Object.assign(
    {},
    compGetItems(state, 'folder'),
    compAddItem(state, 'folder'),
    compDeleteItem(state, 'folder'),
    compGetCurrentFilter(state),
    compSetCurrentFilter(state)
  );
}

// export AppState instance with one default folder, project, and task
export default (function() {
  const appState = AppState();
  
  const firstFolder = Folder('First Folder', 'Default first folder');
  appState.addFolder(firstFolder);
  
  const firstProject = Project('First Project', 'Default first project');
  firstFolder.addProject(firstProject);

  const firstTask = Task(
    'First task',
    format(new Date(), 'MM/dd/yyyy'),
    1,
    'Default first task',
  );
  // console.log('Task due on: ' + firstTask.getDueDate());
  firstProject.addTask(firstTask);

  const secondTask = Task(
    'Second Task',
    format(new Date(), 'MM/dd/yyyy'),
    2,
    'Default second task',
  );
  // console.log('Task due on: ' + firstTask.getDueDate());
  // firstProject.addTask(secondTask);

  return appState;
})();