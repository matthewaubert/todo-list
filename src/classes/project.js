class Project {
  constructor(name, notes) {
    this.name = name;
    this.notes = notes;
    this.tasks = [];
  }

  // getters
  getName() {
    return this.name;
  }
  getProjects() {
    return this.projects;
  }
  getNotes() {
    return this.notes;
  }

  // setters
  setName(newName) {
    this.name = newName;
  }
  addProject(project) {
    this.projects.push(project);
  }
  deleteProject(project) {
    this.projects.splice(this.projects.indexOf(project), 1);
  }
  updateNotes(newNotes) {
    this.notes = newNotes;
  }
}

