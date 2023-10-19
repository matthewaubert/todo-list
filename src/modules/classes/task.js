import Item from './item.js';

// creates Task object instances
export default class Task extends Item {
  constructor(_name, dueDate, priority, notes, project) {
    super(_name);
    this._type = 'task';
    this._id = this._type.charAt(0) + new Date().getTime().toString();
    this._dueDate = dueDate; // format: yyyy-mm-dd
    this._priority = priority;
    this._notes = notes;
    this._completed = false;
    this._project = project; // parent project id
  }

  // GETTERS
  getDueDate() {
    return this._dueDate;
  }
  getPriority() {
    return this._priority;
  }
  getNotes() {
    return this._notes;
  }
  // return id of parent Project instance
  getProject() { 
    return this._project;
  }
  getCompletionStatus() {
    return this._completed;
  }

  // SETTERS
  setDueDate(newDueDate) {
    this._dueDate = newDueDate;
  }
  setPriority(newPriority) {
    this._priority = newPriority;
  }
  setNotes(newNotes) {
    this._notes = newNotes;
  }
  // change id to direct to a different Project instance
  setProject(newProject) {
    this._project = newProject;
  }
  // change completed status to opposite of current boolean value
  toggleCompleted() {
    this._completed = !this._completed;
  }
}