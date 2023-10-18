import { compGetId, compGetName, compGetItems, compGetNotes, compGetItemType, compSetName, compAddItem, compDeleteItem, compSetNotes } from './composition.js';

const compGetFolder = state => ({
  getFolder: () => state.folder
});
const compSetFolder = state => ({
  setFolder: newFolder => state.folder = newFolder
});

// creates Project object instances
export default function Project(name, notes, folder) {
  const state = {
    id: 'p' + new Date().getTime().toString(),
    name,
    notes,
    folder, // parent folder id
    tasks: [], // array of Task object instances
  };

  return Object.assign(
    {},
    compGetId(state),
    compGetName(state),
    compGetNotes(state),
    compGetItems(state, 'task'),
    compGetFolder(state),
    compGetItemType('project'),

    compSetName(state),
    compSetNotes(state),
    compAddItem(state, 'task'),
    compDeleteItem(state, 'task'),
    compSetFolder(state),
  );
}