import Item from './item.js';

// creates Folder object instances
export default class Folder extends Item {
  constructor(_name) {
    super(_name);
    this._type = 'folder';
    this._id = this._type.charAt(0) + new Date().getTime().toString();
    this._projects = []; // array of Project instances
  }

  // GETTERS
  // return all Project instances from _projects array
  getProjects() {
    return this._projects;
  }

  // SETTERS
  // add input Project instance to _projects array
  addProject(project) {
    this._projects.push(project);
  }
  // delete input Project instance from _projects array
  deleteProject(project) {
    this._projects.splice(this._projects.indexOf(project), 1);
  }
}