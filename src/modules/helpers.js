// set multiple attributes; input: HTML element, obj of name-value pairs
function setAttributes(elem, attributes) {
  for (const key in attributes) {
    elem.setAttribute(key, attributes[key]);
  }
}

// translates 'kebab-cased' string to 'camelCase'
function camelize(string) {
  return string.replace(/-./g, x=>x[1].toUpperCase());
}

export { setAttributes, camelize };