// methods to be shared across factory functions for object composition

/* GETTERS */

const compGetId = state => ({
  getId: () => state.id
});

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

const compGetItemType = itemType => ({
  getItemType: () => itemType
});


/* SETTERS */

const compSetName = state => ({
  setName: newName => state.name = newName
});

// adds object to array of objects dependent on this object instance (e.g. Projects, Tasks)
// e.g. method: projectInstance.addTask()
const compAddItem = (state, itemName) => {
  const keyName = 'add' + itemName.charAt(0).toUpperCase() + itemName.slice(1);
  return { [keyName]: item => state[`${itemName}s`].push(item) };
};

// removes object from array of objects dependent on this object instance (e.g. Projects, Tasks)
// e.g. method: projectInstance.deleteTask()
const compDeleteItem = (state, itemName) => {
  const keyName = 'delete' + itemName.charAt(0).toUpperCase() + itemName.slice(1);
  return {
    [keyName]: item => {
      state[`${itemName}s`].splice(state[`${itemName}s`].indexOf(item), 1);
      console.log(`${itemName} deleted`);
    }
  };
};

// return {
//   [keyName]: id => {
//     // filter thru itemName array for item with id
//     const item = state[`${itemName}s`].filter(el => el.getId() === id);
//     // find index of item in array
//     const index = state[`${itemName}s`].indexOf(item);
//     // splice item from array
//     state[`${itemName}s`].splice(index, 1);
//   }
// };

const compSetNotes = state => ({
  setNotes: newNotes => state.notes = newNotes
});

export { compGetId, compGetName, compGetItems, compGetNotes, compGetItemType, compSetName, compAddItem, compDeleteItem, compSetNotes };