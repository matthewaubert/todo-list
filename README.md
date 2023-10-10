# To-Do List

This project was built as part of The Odin Project: JavaScript course in order to continue practicing what I've learned about object oriented programming principles (particularly S.O.L.I.D.) JavaScript modules, npm, and webpack.

## Understanding the Problem

Create a to-do list application with a user interface. The user should have the ability to:
- add tasks to and delete tasks from the to-do list
- edit tasks
- create projects to organize tasks
- create folders to organize projects
- filter tasks by project, folder, date, and priority
- sort tasks items by project, folder, date, and priority

## Plan

1. Project startup:
   - Initialize my project to create a package.json file
   - Install webpack
   - Set up my directories according to convention

2. Set up an HTML skeleton in the dist directory with constant content (e.g. header, sidebar) and a div to hold dynamic content created by JS

3. Brainstorm what properties my task objects will have:
   - title
   - dueDate
   - priority
   - notes
   - project
   - folder
   - checkList

4. Brainstorm what properties my project objects will have:
   - title
   - dueDate
   - notes
   - folder

5. Brainstorm what properties my folder objects will have:
   - title

6. Organize my tasks into projects. There should be a "default" project and the functionality to create new projects and reorganize task items.

7. Organize my projects into folders. There should be a "default" folder and the functionality to create new folders and reorganize projects.

8. Connect the user interface.

9. Enable UI functionality to:
   - View all projects
   - View all to-dos in each project (i.e. filter by project)
   - Expand a single to-do to see/edit its details
   - Add a to-do
   - Delete a to-do

0. Enable local storage to allow persistent data
   - Set up a function that saves tasks, projects, and folders to localStorage
   - Set up a function that looks for data in localStorage when app is first loaded
   - Make sure app doesn't crash if data isn't able to be retrieved from localStorage!