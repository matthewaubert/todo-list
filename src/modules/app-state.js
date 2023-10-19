import { format, parse, differenceInCalendarWeeks, differenceInCalendarMonths } from 'date-fns';
import Folder from './classes/folder';
import Project from './classes/project';
import Task from './classes/task';

// creates AppState instance, which controls state of application;
// caches and contains functions to access all Folder, Project, Task instances;
// caches filters for accessing only Task instances that pass filter
class AppState {
  constructor() {
    this._folders = [];
    this._currentFilter = 'all';
    this._filters = {
      all: task => task.getCompletionStatus() === false,
      checked: task => task.getCompletionStatus() === true,
      today: task => format(new Date(), 'yyyy-MM-dd') === task.getDueDate(),
      week: task => {
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
    }
  }

  // add to AppState instance initial default first Folder, Project, Task instances
  initItems() {
    const firstFolder = new Folder('First Folder');
    this.addFolder(firstFolder);
    
    const firstProject = new Project(
      'First Project',
      'Default first project',
      firstFolder.getId()
    );
    firstFolder.addProject(firstProject);
  
    const firstTask = new Task(
      'First task',
      format(new Date(), 'yyyy-MM-dd'),
      1,
      'Default first task',
      firstProject.getId()
    );
    firstProject.addTask(firstTask);
  }

  // return all Folder instances from _folders array
  getFolders() {
    return this._folders;
  }
  // return Folder instance from _folders array that matches input id
  getFolderById(targetId) {
    return this._folders
      .find(folder => folder.getId() === targetId);
  }

  // return all Project instances from AppState instance
  getProjects() {
    const selectedProjects = [];
    this.getFolders().forEach(folder => {
      selectedProjects.push(...folder.getProjects());
    });

    return selectedProjects;
  }
  // return Project instance from AppState instance that matches input id
  getProjectById(targetId) {
    let selectedProject;
    this.getFolders().forEach(folder => {
      const foundProject = folder.getProjects()
        .find(project => project.getId() === targetId);
      if (foundProject) selectedProject = foundProject;
    });

    return selectedProject;
  }

  // return all Task instances from AppState instance; accepts optional filter name
  getTasks(filterName) {
    const selectedTasks = [];
    if (filterName) {
      this.getFolders().forEach(folder => {
        folder.getProjects().forEach(project => {
          selectedTasks.push(...project.getTasks()
            .filter(task => this.getFilters()[filterName](task)));
        });
      });
    } else {
      this.getFolders().forEach(folder => {
        folder.getProjects().forEach(project => {
          selectedTasks.push(...project.getTasks());
        });
      });
    }

    return selectedTasks;
  }
  // return Task instance from AppState instance that matches id
  getTaskById(targetId) {
    let selectedTask;
    this.getFolders().forEach(folder => {
      folder.getProjects().forEach(project => {
        const foundTask = project.getTasks()
          .find(task => task.getId() === targetId);
        if (foundTask) selectedTask = foundTask;
      });
    });

    return selectedTask;
  }
  // redirect to appropriate get___ById func based on input id
  getItemById(targetId) {
    // look for item by id starting letter
    const idLetter = targetId.charAt(0);
    switch (idLetter) {
      case 'f':
        return this.getFolderById(targetId);
      case 'p':
        return this.getProjectById(targetId);
      case 't':
        return this.getTaskById(targetId);
    }
  }

  // add input Folder instance to _folders array
  addFolder(newFolder) {
    this._folders.push(newFolder);
  }
  // delete input Folder instance from _folders array
  deleteFolder(folder) {
    this._folders.splice(this._folders.indexOf(folder), 1); // remove folder from _folders array
    console.log('folder deleted');
  }

  // return string of item type based on input item id
  getItemTypeById(targetId) {
    const idLetter = targetId.charAt(0);
    switch (idLetter) {
      case 'f':
        return 'folder';
      case 'p':
        return 'project';
      case 't':
        return 'task';
    }
  }

  // return current filter
  getCurrentFilter() {
    return this._currentFilter;
  }
  // change current filter to new filter
  setCurrentFilter(newFilter) {
    this._currentFilter = newFilter;
  }

  // return AppState instance _filters object
  getFilters() {
    return this._filters;
  }

}

// export single AppState instance
export default (function() {
  return new AppState();
})();