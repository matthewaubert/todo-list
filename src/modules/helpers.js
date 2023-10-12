// set multiple attributes; input: HTML element, obj of name-value pairs
function setAttributes(elem, attributes) {
  for (const key in attributes) {
    elem.setAttribute(key, attributes[key]);
  }
}

export { setAttributes };