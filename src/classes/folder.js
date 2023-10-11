/* USING CLASS INHERITANCE */

class Folder {
  constructor(name) {
    this.name = name;
    this.projects = [];
  }

  // getters
  getName() {
    return this.name;
  }
  getProjects() {
    return this.projects;
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
}


/* USING FACTORY FUNCTIONS */

function Folder(name) {
  const projects = [];

  // getters
  const getName = () => name;
  const getProjects = () => projects;

  // setters
  const setName = newName => name = newName;
  const addProject = project => projects.push(project);
  const deleteProject = project => projects.splice(projects.indexOf(project), 1);

  return { getName, getProjects, setName, addProject, deleteProject };
}


/* USING OBJECT COMPOSITION */

// getters
const nameGetter = state => ({
  getName: () => state.name
});
const projectGetter = state => ({
  getProjects: () => state.projects
});

// setters
const nameSetter = state => ({
  setName: newName => state.name = newName
});
const projectAdder = state => ({
  addProject: project => state.projects.push(project)
});
const projectDeleter = state => ({
  deleteProject: project => state.projects.splice(state.projects.indexOf(project), 1)
});

function Folder(name) {
  let state = {
    name,
    projects: []
  }

  return Object.assign(
    {},
    nameGetter(state),
    projectGetter(state),
    nameSetter(state),
    projectAdder(state),
    projectDeleter(state)
  );
}

const newFolder = Folder('New Folder');
// console.log(newFolder);
console.log(newFolder.getName());
newFolder.setName('Better Folder Name');
console.log(newFolder.getName());