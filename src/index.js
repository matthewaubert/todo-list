import appState from './modules/app-state.js';
import { storageAvailable, serializeItems, deserializeItems } from './modules/local-storage.js';
import renderController from './modules/render-controller.js';
import { camelize, capitalize } from './modules/helpers.js';
import Task from './modules/classes/task.js';
import Project from './modules/classes/project.js';
import Folder from './modules/classes/folder.js';

// cache DOM
const nav = document.querySelector('#nav');
const navArrows = document.querySelectorAll('.nav-arrow');
const navFilters = nav.querySelectorAll('li');
const addItemBtn = document.querySelector('.add-item');
const modalMenu = document.querySelector('#modal-menu');
const modalOptions = document.querySelectorAll('#modal-menu > p');
const modalBackdrop = document.querySelector('#modal-backdrop');
const modalForms = document.querySelectorAll('.modal-form');

// add event listeners
document.addEventListener('DOMContentLoaded', initApp);
navArrows.forEach(navArrow => navArrow.addEventListener('click', toggleNav));
navFilters.forEach(navFilter => navFilter.addEventListener('click', loadFilter));
addItemBtn.addEventListener('click', toggleModalMenu);
document.addEventListener('click', hideModalMenu);
modalOptions.forEach(option => option.addEventListener('click', showModal));
modalBackdrop.addEventListener('click', hideModal);
modalForms.forEach(form => form.addEventListener('submit', handleFormSubmission));


/* INITIALIZE APP */

// once DOM content loaded, init app
function initApp() {
  if (storageAvailable("localStorage")) {
    if (!localStorage.getItem('appStateFolders')) {
      appState.initItems(); // create default first items
      serializeItems(); // store items in localStorage
    } else {
      deserializeItems(); // get items from localStorage
    }
  } else {
    appState.initItems(); // create default first items
  }

  renderController.renderPage();
}


/* NAV FUNCTIONALITY */

function toggleNav() {
  nav.classList.toggle('hidden');
  navArrows.forEach(navArrow => navArrow.classList.toggle('rotated'));
}

function loadFilter(e) {
  if (!e.target.dataset.for) {
    renderController.clearTasks(); // clear tasks
    deleteItem.checkedTasks(); // delete checked tasks

    appState.setCurrentFilter(this.dataset.name); // change appState.currentFilter
    renderController.renderTasks(this.dataset); // render tasks according to filter
    renderController.renderHeader(this); // render header according to filter

    // remove background from all other lis
    const currentNavFilters = nav.querySelectorAll('li');
    currentNavFilters.forEach(navFilter => navFilter.classList.remove('selected'));
    this.classList.add('selected'); // darken selected li background

    toggleNav(); // hide nav
  }
}


/* MODAL FUNCTIONALITY */

// toggle menu with 3 options: create task, create project, create folder
function toggleModalMenu() {
  addItemBtn.classList.toggle('rotated'); // rotate addItemBtn button 45deg
  modalMenu.classList.toggle('hidden'); // toggle modal menu
}

function hideModalMenu(e) {
  if (e.target !== addItemBtn) {
    addItemBtn.classList.remove('rotated');
    modalMenu.classList.add('hidden');
  }
}

// show modal backdrop, modal dialogue depending which was selected
function showModal() {
  modalBackdrop.classList.remove('hidden');

  // filter thru modal forms for matching id
  const correctForm = Array.from(modalForms)
    .find(form => form.id === this.dataset.for);
  correctForm.classList.remove('hidden');

  // if it's an edit form, show edit modal
  if (this.dataset.for.includes('edit-')) {
    showEditModal(correctForm, this.parentNode.dataset.id);
  }
}

function showEditModal(form, targetId) {
  form.dataset.for = targetId;
  const item = appState.getItemById(targetId); // get target task, project, or folder

  setFormValues(form, item);
}

// hide modal backdrop and modal dialogues
function hideModal(e) {
  if (e.target.id === 'modal-backdrop' ||
      e.target.classList.contains('cancel') ||
      e.type === 'submit') {
    modalBackdrop.classList.add('hidden');
    modalForms.forEach(form => {
      form.classList.add('hidden');
      form.reset();
    });
  }
}

// extract form values to create correct item, hide modal, reset form
function handleFormSubmission(e) {
  e.preventDefault();
  const formValues = getFormValues(e.target); // extract values from form
  // console.log(formValues);

  const itemName = e.target.id.split('-')[0];
  createItem[itemName](formValues, e.target.dataset.for);

  hideModal(e);
}

// extract field values from form submission; return values as obj
function getFormValues(formValues) {
  return Object.values(formValues).reduce((obj, field) => {
    // if not a button
    if (field.tagName !== 'BUTTON') {
      if (field.type === 'radio') {
        if (field.checked) obj[field.name] = Number(field.value);
      } else {
        obj[camelize(field.name)] = field.value;
      }
    }
    return obj;
  }, {});
}

// set each form field to appropriate value from item object
function setFormValues(form, item) {
  Array.from(form.elements).forEach(field => {
    // don't do anything with buttons
    if (field.tagName !== 'BUTTON') {
      // handle radio inputs differently
      if (field.type === 'radio') {
        if (Number(field.value) === item.getPriority()) {
          field.checked = true;
        }
      } else {
        field.value = item[camelize(`get-${field.name}`)]();
      }
    }
  });
}

// object to hold funcs to create/edit items from form submission
const createItem = {
  // create new Task instance from form submission
  task: formValues => {
    const newTask = new Task(formValues.name, formValues.dueDate, formValues.priority, formValues.notes, formValues.project);
    // push Task to parentProject tasks array
    const parentProject = appState.getProjectById(formValues.project);
    if (parentProject) parentProject.addTask(newTask);
  
    renderController.renderItem.task(newTask);
    if (storageAvailable("localStorage")) serializeItems(); // update storage
  },
  // create new Project instance from form submission
  project: formValues => {
    const newProject = new Project(formValues.name, formValues.notes, formValues.folder);
    // push Project to parentFolder projects array
    let parentFolder = appState.getFolderById(formValues.folder);
    if (parentFolder) parentFolder.addProject(newProject);

    renderController.renderItem.project(newProject);
    if (storageAvailable("localStorage")) serializeItems(); // update storage
  },
  // create new Folder instance from form submission
  folder: formValues => {
    const newFolder = new Folder(formValues.name);
    appState.addFolder(newFolder); // push Folder to appState folders array
  
    renderController.renderItem.folder(newFolder);
    if (storageAvailable("localStorage")) serializeItems(); // update storage
  },
  // edit Item instance from form submission
  edit: (formValues, itemId) => {
    console.log(formValues);
    const item = appState.getItemById(itemId); // get item by id
    
    // if item is a Task or Project, move item to correct parent project/folder
    if (item instanceof Task || item instanceof Project) {
      changeItemParent(item, formValues);
    }
  
    // iterate over formValues and run appropriate setter funcs on item
    for (const value in formValues) {
      console.log(`${value}: ${formValues[value]}`);
      item[`set${capitalize(value)}`](formValues[value]);
    }
    console.log(item);
  
    renderController.removeItem(itemId); // delete related els from DOM
    renderController.renderItem[item.getItemType()](item); // render item
    // if item is a folder, render child projects
    if (item instanceof Folder) {
      item.getProjects().forEach(project => {
        renderController.renderItem.project(project);
      });
    }

    if (storageAvailable("localStorage")) serializeItems(); // update storage
  }
};

// if parent project/folder has changed, move item to correct parent project/folder
function changeItemParent(item, formValues) {
  const parentType = item instanceof Task ? 'Project' : 'Folder'; // get parent type
  const parentId = item[`get${parentType}`](); // get parent id

  if (parentId !== formValues[parentType.toLowerCase()]) {
    const itemType = capitalize(appState.getItemTypeById(item.getId())); // get item type

    // get old parent by id and remove item from parent
    const oldParent = appState[`get${parentType}ById`](parentId);
    oldParent[`delete${itemType}`](item);

    // get new parent by id and add item to parent
    const newParent = appState[`get${parentType}ById`](
      formValues[parentType.toLowerCase()]
    );
    newParent[`add${itemType}`](item);
  }
}


/* MAIN PAGE FUNCTIONALITY */

// object to hold funcs to delete items from appState and remove DOM renderings
const deleteItem = {
  // delete all tasks with 'checked: true' property when user selects new filter
  checkedTasks: function() {
    const tasks = appState.getTasks('checked'); // get all checked tasks
    // for each checked task
    tasks.forEach(task => {
      renderController.removeItem(task.getId()); // remove all renderings of task in DOM

      const parentProject = appState.getProjectById(task.getProject()); // find parent project
      parentProject.deleteTask(task); // delete task from parent project
    });

    if (storageAvailable("localStorage")) serializeItems(); // update storage
  },
  // delete project when user clicks trash icon and confirms
  project: function() {
    if (confirm('Are you sure you want to delete this project?')) {
      // get project by id
      const projectId = this.parentNode.dataset.id;
      const project = appState.getProjectById(projectId);
      
      // remove all renderings of project and children in DOM
      project.getTasks().forEach(task => renderController.removeItem(task.getId()));
      renderController.removeItem(projectId);
      
      // get parent folder from appState
      const folderId = project.getFolder();
      const folder = appState.getFolderById(folderId);
      folder.deleteProject(project); // delete project from folder

      if (storageAvailable("localStorage")) serializeItems(); // update storage
    }
  },
  // delete folder when user clicks trash icon and confirms
  folder: function() {
    if (confirm('Are you sure you want to delete this folder?')) {
      // get folder by id
      const folderId = this.parentNode.dataset.id;
      const folder = appState.getFolderById(folderId);

      // remove all renderings of folder and children from DOM
      folder.getProjects().forEach(project => {
        project.getTasks().forEach(task => renderController.removeItem(task.getId()));
        renderController.removeItem(project.getId());
      });
      renderController.removeItem(folderId);

      appState.deleteFolder(folder); // delete folder from appState

      if (storageAvailable("localStorage")) serializeItems(); // update storage
    }
  }
}

// toggle completion status of task, gray out HTML element
function toggleCompleted(e) {
  const targetTask = appState.getTaskById(e.target.id);
  if (targetTask) targetTask.toggleCompleted();

  e.target.parentNode.classList.toggle('completed');

  if (storageAvailable("localStorage")) serializeItems(); // update storage
}


export { loadFilter, showModal, deleteItem, toggleCompleted };