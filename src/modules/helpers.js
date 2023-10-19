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

// convert first char of string to uppercase
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// create svg from viewBox and dPath
function createSvg(viewBox, dPath) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  svg.setAttribute('viewBox', viewBox);
  path.setAttribute('d', dPath);
  svg.appendChild(path);

  return svg;
}

export { setAttributes, camelize, capitalize, createSvg };