const DataBase = require('./database').Database;
const { schema1, schema2, schema3 } = require('./tableSchema');

class Library {
  constructor(path) {
    this.db = new DataBase(path);
  }

  get_method(command) {
    const methods = { addBook: this.addBook, show: this.show };
    return methods[command].bind(this);
  }

  addBook(info) {
    return this.db.insertInTable('books', info);
  }

  show({ table }) {
    this.db.selectAll(`select * from ${table};`, (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        console.log();
        console.table(rows);
      }
    });
  }

  run(command, info) {
    const operation = this.get_method(command);
    return operation(info);
  }

  static init(path) {
    const library = new Library(path);

    library.db.creatTable(schema1);
    library.db.creatTable(schema2);
    library.db.creatTable(schema3);

    return library;
  }
}

module.exports = { Library };
