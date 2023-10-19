# To-Do List

This project was built as part of <a href="https://www.theodinproject.com/lessons/node-path-javascript-todo-list">The Odin Project: JavaScript course</a> in order to continue practicing what I've learned about object oriented programming principles (particularly S.O.L.I.D.) JavaScript modules, npm, and webpack.

## Understanding the Problem

Create a to-do list application with a user interface. The user should have the ability to:
- add tasks to and delete tasks from the to-do list
- edit tasks
- create projects to organize tasks
- create folders to organize projects
- filter tasks by project, folder, and date

## Plan

1. Project startup:
   1. Initialize my project to create a package.json file
   1. Install webpack
   1. Set up my directories according to convention

1. Set up an index.html HTML skeleton in the dist directory with constant content (e.g. header, sidebar) and a div to hold dynamic content created by JS

1. Set up an index.js file, which will be the central module
   - Keep in mind to split functionality amongst other JS modules as appropriate
   - Keep my application logic separate from DOM-related logic

1. Reference the webpack docs in order to:
   1. Bundle my JS files
   1. Bundle my images/assets
   1. Bundle my CSS

1. Brainstorm what properties my item objects will have:
   - Task objects
     - name
     - type
     - unique id
     - dueDate
     - priority
     - notes
     - completed
     - parent project id
     - checkList?
   - Project objects
     - name
     - type
     - unique id
     - notes
     - parent folder id
     - array of tasks
   - Folder objects
     - name
     - type
     - unique id
     - array of projects

1. Organize my tasks into projects. There should be a "default" project and the functionality to create new projects and reorganize task items.

1. Organize my projects into folders. There should be a "default" folder and the functionality to create new folders and reorganize projects.

1. Brainstorm how I will organize my folders

1. Connect the user interface

1. Enable UI functionality to:
   1. View all projects
   1. View all task in each project (i.e. filter by project)
   1. Expand a single task to see/edit its details
   1. Add a task, project, or folder
   1. Delete a task, project, or folder

1. Style UI

1. Enable local storage to allow persistent data
   1. Set up a function that saves tasks, projects, and folders to localStorage
   1. Set up a function that looks for data in localStorage when app is first loaded
   - Make sure app doesn't crash if data isn't able to be retrieved from localStorage!

### Inspiration

- <a href="https://culturedcode.com/things/">Things</a>
- <a href="https://todoist.com/">Todoist</a>