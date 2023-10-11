// create tab header element
function createHeader(text, level) {
  const title = document.createElement(`h${level}`);
  title.innerText = text;

  return title;
}

// create paragraph element
function createParagraph(text) {
  const paragraph = document.createElement('p');
  paragraph.innerText = text;
  
  return paragraph;
}

// assemble obj of HTML elements into container div
function assemble(obj, className) {
  const container = document.createElement('div');
  if (className) container.classList.add(className);

  for (const key in obj) {
    container.appendChild(obj[key]);
  }

  return container;
}

export { createHeader, createParagraph, assemble };