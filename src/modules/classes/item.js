// methods to be shared across Folder, Project, and Task classes

export default class Item {
  constructor(_name) {
    this._name = _name;
  }

  // getters
  getName() {
    return this._name;
  }
  getId() {
    return this._id;
  }
  getItemType() {
    return this._type;
  }

  // setters
  setName(newName) {
    this._name = newName;
  }
}