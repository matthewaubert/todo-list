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

  // getters
  getNotes() {
    return this._notes;
  }
  getFolder() { 
    return this._folder;
  }
  getTasks() {
    return this._tasks;
  }

  // setters
  setNotes(newNotes) {
    this._notes = newNotes;
  }
  setFolder(newFolder) {
    this._folder = newFolder;
  }
  addTask(task) {
    this._tasks.push(task);
  }
  deleteTask(task) {
    this._tasks.splice(this._tasks.indexOf(task), 1);
    console.log(`${task.getName()} deleted`);
  }
}