import { compGetId, compGetName, compGetItems, compSetName, compAddItem, compDeleteItem, compGetItemType } from './composition.js';

// creates Folder object instances
export default function Folder(name) {
  const state = {
    id: 'f' + new Date().getTime().toString(),
    name,
    projects: [] // array of Project object instances
  };

  return Object.assign(
    {},
    compGetId(state),
    compGetName(state),
    compGetItems(state, 'project'),
    compGetItemType('folder'),

    compSetName(state),
    compAddItem(state, 'project'),
    compDeleteItem(state, 'project'),
  );
}

// const newFolder = Folder('New Folder');
// console.log(newFolder);
// console.log(newFolder.getName());
// newFolder.setName('Better Folder Name');
// console.log(newFolder.getName());
// newFolder.addProject('project1');
// newFolder.addProject('project2');
// console.log(newFolder.getProjects());
// newFolder.deleteProject('project1');
// console.log(newFolder.getProjects());