import Item from './item.js';

// creates Folder object instances
export default class Folder extends Item {
  constructor(_name) {
    super(_name);
    this._type = 'folder';
    this._id = this._type.charAt(0) + new Date().getTime().toString();
    this._projects = []; // array of Project instances
  }

  // getters
  getProjects() {
    return this._projects;
  }

  // setters
  addProject(project) {
    this._projects.push(project);
  }
  deleteProject(project) {
    this._projects.splice(this._projects.indexOf(project), 1);
    console.log(`${project.getName()} deleted`);
  }
}


// const newFolder = new Folder('New Folder');
// console.log(newFolder.getId());
// console.log(newFolder.getItemType());
// console.log(newFolder);
// console.log(newFolder.getName());
// newFolder.setName('Better Folder Name');
// console.log(newFolder.getName());
// newFolder.addProject('project1');
// newFolder.addProject('project2');
// console.log(newFolder.getProjects());
// newFolder.deleteProject('project1');
// console.log(newFolder.getProjects());