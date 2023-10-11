import { compGetName, compGetItems, compGetNotes, compSetName, compAddItem, compDeleteItem, compSetNotes } from './composition.js';

// creates Project object instances
export default function Project(name, notes) {
  const state = {
    name,
    notes,
    tasks: [] // array of Task object instances
  }

  return Object.assign(
    {},
    compGetName(state),
    compGetNotes(state),
    compGetItems(state, 'task'),

    compSetName(state),
    compSetNotes(state),
    compAddItem(state, 'task'),
    compDeleteItem(state, 'task')
  );
}