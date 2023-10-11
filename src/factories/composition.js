// methods to be shared across factory functions for object composition

/* GETTERS */

const compGetName = state => ({
  getName: () => state.name
});

// returns array of objects dependent on this object instance (e.g. Projects, Tasks)
// e.g. method: projectInstance.getTasks()
const compGetItems = (state, itemName) => {
  const keyName = 'get' + itemName.slice(0, 1).toUpperCase() + itemName.slice(1) + 's'
  return { [keyName]: () => state[`${itemName}s`] };
};

const compGetNotes = state => ({
  getNotes: () => state.notes
});


/* SETTERS */

const compSetName = state => ({
  setName: newName => state.name = newName
});

// adds object to array of objects dependent on this object instance (e.g. Projects, Tasks)
// e.g. method: projectInstance.addTask()
const compAddItem = (state, itemName) => {
  const keyName = 'add' + itemName.slice(0, 1).toUpperCase() + itemName.slice(1)
  return { [keyName]: item => state[`${itemName}s`].push(item) };
};

// removes object from array of objects dependent on this object instance (e.g. Projects, Tasks)
// e.g. method: projectInstance.deleteTask()
const compDeleteItem = (state, itemName) => {
  const keyName = 'delete' + itemName.slice(0, 1).toUpperCase() + itemName.slice(1)
  return { [keyName]: item => state[`${itemName}s`].splice(state[`${itemName}s`].indexOf(item), 1) };
};

const compSetNotes = state => ({
  setNotes: newNotes => state.notes = newNotes
});

export { compGetName, compGetItems, compGetNotes, compSetName, compAddItem, compDeleteItem, compSetNotes };