const {DataBase} = require("./database");
const [schema1, schema2, schema3] = require('./tableSchema');

class Library {
  constructor (path) {
    this.db = new DataBase(path)
    this.methods = {addBook : this.addBook};
  }

  addBook(arguments) {
    return this.db.insertInTable('books', arguments);
  }

  show(table) {
    this.db.selectAll(`select * from ${table}`, (rows) => console.table(rows));
  }

  run(command, arguments) {
    return this.methods[command](arguments);
  }

  init(path) {
    const library = new Library(path);

    library.db.createTable(schema1);
    library.db.createTable(schema2);
    library.db.createTable(schema3);

    return library;
  }
}