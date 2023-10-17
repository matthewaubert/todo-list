import { format, parse, differenceInCalendarWeeks, differenceInCalendarMonths } from 'date-fns';
import Folder from './factories/folder';
import Project from './factories/project';
import Task from './factories/task';

class AppState {
  constructor() {
    this._folders = [];
    this.currentFilter = 'all';
    this.filters = {
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
    }
  }

  // get all folders from AppState; accepts optional filter
  getFolders() {
    return this._folders;
  }
  // get folder from AppState that matches id
  getFolderById(targetId) {
    return this._folders
      .find(folder => folder.getId() === targetId);
  }

  // get all projects from AppState instance
  getProjects() {
    const selectedProjects = [];
    this.getFolders().forEach(folder => {
      selectedProjects.push(...folder.getProjects());
    });

    return selectedProjects;
  }
  // get project from AppState that matches id
  getProjectById(targetId) {
    let selectedProject;
    this.getFolders().forEach(folder => {
      const foundProject = folder.getProjects()
        .find(project => project.getId() === targetId);
      if (foundProject) selectedProject = foundProject;
    });

    return selectedProject;
  }

  // get tasks from AppState; accepts optional filter, comparison value
  getTasks(filter, targetValue) {
    const selectedTasks = [];
    if (filter) {
      this.getFolders().forEach(folder => {
        folder.getProjects().forEach(project => {
          selectedTasks.push(...project.getTasks()
            .filter(task => this.filters[filter](task, targetValue))
          );
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
  // get task from AppState that matches id
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
  // redirect to appropriate get__ById func
  getItemById(targetId) {
    // look for item by id starting letter
    const idLetter = targetId.slice(0, 1);
    switch (idLetter) {
      case 'f':
        return this.getFolderById(targetId);
      case 'p':
        return this.getProjectById(targetId);
      case 't':
        return this.getTaskById(targetId);
    }
  }

  addFolder(newFolder) {
    this._folders.push(newFolder);
  }
  deleteFolder(folderId) {
    const folder = this.getFolderById(folderId); // find folder by id
    this._folders.splice(this._folders.indexOf(folder), 1); // remove folder from _folders array
  }

  getItemTypeById(targetId) {
    const idLetter = targetId.slice(0, 1);
    switch (idLetter) {
      case 'f':
        return 'folder';
      case 'p':
        return 'project';
      case 't':
        return 'task';
    }
  }

  // getProjectFolder(childProject) {
  //   let parentFolder;
  //   this.getFolders().forEach(folder => {
  //     folder.getProjects().forEach(project => {
  //       if (project.getId() === childProject.getId()) parentFolder = folder;
  //     });
  //   });

  //   return parentFolder;
  // }

}

// export AppState instance with one default folder, project, and task
export default (function() {
  const appState = new AppState();
  
  const firstFolder = Folder('First Folder', 'Default first folder');
  appState.addFolder(firstFolder);
  
  const firstProject = Project(
    'First Project',
    'Default first project',
    firstFolder.getId()
  );
  firstFolder.addProject(firstProject);

  const firstTask = Task(
    'First task',
    format(new Date(), 'yyyy-MM-dd'),
    1,
    'Default first task',
    firstProject.getId(),
  );
  // console.log('Task due on: ' + firstTask.getDueDate());
  firstProject.addTask(firstTask);

  // const secondTask = Task(
  //   'Second Task',
  //   format(new Date(), 'yyyy-MM-dd'),
  //   2,
  //   'Default second task',
  // );
  // console.log('Task due on: ' + firstTask.getDueDate());
  // firstProject.addTask(secondTask);

  return appState;
})();