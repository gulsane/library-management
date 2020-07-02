const {DataBase} = require("./database");

class Library {
  constructor (path) {
    this.db = new DataBase(path)
    this.methods = {};
  }
  init(path) {
    const library = new Library(path);
    library.db.createTable('books', 'schema')
  }
}