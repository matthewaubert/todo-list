import Item from './item.js';

// creates Project object instances
export default class Project extends Item {
  constructor(_name, notes, folder) {
    super(_name);
    this._type = 'project';
    this._id = this._type.charAt(0) + new Date().getTime().toString();
    this._notes = notes;
    this._folder = folder; // parent folder id
    this._tasks = []; // array of Task object instances
  }

  // GETTERS
  getNotes() {
    return this._notes;
  }
  // return id of parent Folder instance
  getFolder() {
    return this._folder;
  }
  // return all Task instances from _tasks array
  getTasks() {
    return this._tasks;
  }

  // SETTERS
  setNotes(newNotes) {
    this._notes = newNotes;
  }
  // change id to direct to a different Folder instance
  setFolder(newFolder) {
    this._folder = newFolder;
  }
  // add input Task instance to _tasks array
  addTask(task) {
    this._tasks.push(task);
  }
  // delete input Task instance from _tasks array
  deleteTask(task) {
    this._tasks.splice(this._tasks.indexOf(task), 1);
    console.log(`${task.getName()} deleted`);
  }
}