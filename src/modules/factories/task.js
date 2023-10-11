import { compGetId, compGetName, compGetNotes, compSetName, compSetNotes } from './composition.js';

// getters
const compGetDueDate = state => ({
  getDueDate: () => state.dueDate
});
const compGetPriority = state => ({
  getPriority: () => state.priority
});
const compGetCompletionStatus = state => ({
  getCompletionStatus: () => state.completed
});

// setters
const compSetDueDate = state => ({
  setDueDate: newDueDate => state.dueDate = newDueDate
});
const compSetPriority = state => ({
  setPriority: newPriority => state.priority = newPriority
});
const compToggleCompleted = state => ({
  toggleCompleted: () => state.completed = !state.completed
});

// creates Task object instances
export default function Task(name, dueDate, priority, notes) {
  const state = {
    id: 't' + new Date().getTime().toString(),
    name,
    dueDate, // yyyy-mm-dd
    priority,
    notes,
    completed: false,
  }

  return Object.assign(
    {},
    compGetId(state),
    compGetName(state),
    compGetNotes(state),
    compGetDueDate(state),
    compGetPriority(state),
    compGetCompletionStatus(state),

    compSetName(state),
    compSetNotes(state),
    compSetDueDate(state),
    compSetPriority(state),
    compToggleCompleted(state),
  );
}