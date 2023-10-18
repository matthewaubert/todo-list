import { compGetId, compGetName, compGetNotes, compGetItemType, compSetName, compSetNotes } from './composition.js';

// getters
const compGetDueDate = state => ({
  getDueDate: () => state.dueDate
});
const compGetPriority = state => ({
  getPriority: () => state.priority
});
const compGetProject = state => ({
  getProject: () => state.project
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
const compSetProject = state => ({
  setProject: newProject => state.project = newProject
})
const compToggleCompleted = state => ({
  toggleCompleted: () => state.completed = !state.completed
});

// creates Task object instances
export default function Task(name, dueDate, priority, notes, project) {
  const state = {
    id: 't' + new Date().getTime().toString(),
    name,
    dueDate, // yyyy-mm-dd
    priority,
    notes,
    completed: false,
    project, // parent project id
  };

  return Object.assign(
    {},
    compGetId(state),
    compGetName(state),
    compGetNotes(state),
    compGetDueDate(state),
    compGetPriority(state),
    compGetProject(state),
    compGetCompletionStatus(state),
    compGetItemType('task'),

    compSetName(state),
    compSetNotes(state),
    compSetDueDate(state),
    compSetPriority(state),
    compSetProject(state),
    compToggleCompleted(state),
  );
}