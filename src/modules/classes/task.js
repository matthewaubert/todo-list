import Item from './item.js';

// creates Task object instances
export default class Task extends Item {
  constructor(_name, dueDate, priority, notes, project) {
    super(_name);
    this._type = 'task';
    this._id = this._type.charAt(0) + new Date().getTime().toString();
    this._dueDate = dueDate;
    this._priority = priority;
    this._notes = notes;
    this._completed = false;
    this._project = project; // parent project id
  }

  // getters
  getDueDate() {
    return this._dueDate;
  }
  getPriority() {
    return this._priority;
  }
  getNotes() {
    return this._notes;
  }
  getProject() { 
    return this._project;
  }
  getCompletionStatus() {
    return this._completed;
  }

  // setters
  setDueDate(newDueDate) {
    this._dueDate = newDueDate;
  }
  setPriority(newPriority) {
    this._priority = newPriority;
  }
  setNotes(newNotes) {
    this._notes = newNotes;
  }
  setProject(newProject) {
    this._project = newProject;
  }
  toggleCompleted() {
    this._completed = !this._completed;
  }
}