import { format, parse, differenceInCalendarWeeks, differenceInCalendarMonths } from 'date-fns';
import { compGetItems, compAddItem, compDeleteItem } from './factories/composition';
import Folder from './factories/folder';
import Project from './factories/project';
import Task from './factories/task';

const compGetCurrentFilter = state => ({
  getCurrentFilter: () => state.currentFilter
});
const compSetCurrentFilter = state => ({
  setCurrentFilter: newPage => state.currentFilter = newPage
});
const compGetFilters = state => ({
  getFilters: () => state.filters
});

// create AppState object: contains an array of folders and related methods
function AppState() {
  const state = {
    folders: [], // array of Folder object instances
    currentFilter: 'all',
    filters: { // need to know which property to pull from item, what the value should match
      all: task => task.getCompletionStatus() === false,
      today: task => format(new Date(), 'yyyy-MM-dd') === task.getDueDate(),
      week: task => {
        // console.log(task.getDueDate());
        return differenceInCalendarWeeks(
          new Date(),
          parse(task.getDueDate(), 'yyyy-MM-dd', new Date())
        ) === 0;
      },
      month: task => {
        return differenceInCalendarMonths(
          new Date(),
          parse(task.getDueDate(), 'yyyy-MM-dd', new Date())
        ) === 0;
      },
      task: (task, targetId) => task.getId() === targetId,
      project: function(targetTask, targetId) {
        let returnValue = false;
        state.folders.forEach(folder => {
          folder.getProjects().forEach(project => {
            project.getTasks().forEach(task => {
              if (this.task(task, targetTask.getId()) && project.getId() === targetId) returnValue = true;
            });
          });
        });
        return returnValue;
      },
      folder: function(targetTask, targetId) {
        let returnValue = false;
        state.folders.forEach(folder => {
          folder.getProjects().forEach(project => {
            project.getTasks().forEach(task => {
              if (this.task(task, targetTask.getId()) && folder.getId() === targetId) returnValue = true;
            });
          });
        });
        return returnValue;
      }
    }
  }

  return Object.assign(
    {},
    compGetItems(state, 'folder'),
    compAddItem(state, 'folder'),
    compDeleteItem(state, 'folder'),
    compGetCurrentFilter(state),
    compSetCurrentFilter(state),
    compGetFilters(state)
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
    format(new Date(), 'yyyy-MM-dd'),
    1,
    'Default first task',
  );
  // console.log('Task due on: ' + firstTask.getDueDate());
  firstProject.addTask(firstTask);

  const secondTask = Task(
    'Second Task',
    format(new Date(), 'yyyy-MM-dd'),
    2,
    'Default second task',
  );
  // console.log('Task due on: ' + firstTask.getDueDate());
  // firstProject.addTask(secondTask);

  return appState;
})();