import { format } from 'date-fns';
import { appState } from '../index';
import { setAttributes } from './helpers';

// cache DOM
const main = document.querySelector('#main');

// filter thru appState for tasks
function renderTasks(filter) {
  const filters = {
    today: format(new Date(), 'MM/dd/yyyy'),
  };
  const allTasks = [];

  appState.getFolders().forEach(folder => {
    folder.getProjects().forEach(project => {
      if (filter) {
        allTasks.push(...project.getTasks()
          .filter(task => task.getDueDate() === filters[filter]));
      } else {
        allTasks.push(...project.getTasks());
      }
    });
  });

  const ul = document.createElement('ul');

  // console.log(allTasks[0].getName());
  allTasks.forEach(task => ul.appendChild(renderTask(task)));
  main.appendChild(ul);
}

// return a div containing a checkbox and label relating to the input task
function renderTask(task) {
  // create checkbox
  const check = document.createElement('input');
  setAttributes(check, {
    'type': 'checkbox',
    'id': task.getId()
  });
  check.addEventListener('change', toggleCompleted);
  
  // create label
  const label = document.createElement('label');
  label.setAttribute('for', task.getId());
  label.innerText = task.getName();
  
  // append checkbox and label to wrapper div
  const div = document.createElement('div');
  div.classList.add('task-main');
  div.dataset.id = task.getId();
  div.append(check, label);

  return div;
}

// toggle completion status of task, gray out HTML el
function toggleCompleted(e) {
  // console.log(e.target.id);

  appState.getFolders().forEach(folder => {
    folder.getProjects().forEach(project => {
      const targetTask = project.getTasks().filter(task => task.getId() === e.target.id)[0];
      targetTask.toggleCompleted();
      // console.log(targetTask.getCompletionStatus());
    });
  });

  e.target.parentNode.classList.toggle('completed');
}

export { renderTasks };