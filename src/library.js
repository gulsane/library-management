const DataBase = require('./database').Database;
const { schema1, schema2, schema3 } = require('./tableSchema');

class Library {
  constructor(path) {
    this.db = new DataBase(path);
  }

  addBook({ ISBN, title, category, author }) {
    return new Promise((resolve, reject) => {
      this.db.getSerialNumber().then((serial_number) => {
        const serial_no = serial_number == null ? 1 : serial_number + 1;
        this.db
          .insertInTable('books', [ISBN, title, category, author])
          .then(() =>
            this.db.insertInTable('book_copies', [ISBN, serial_no, true])
          )
          .then(() => resolve('OK'))
          .catch((msg) => reject(`error happened with msg : ${msg}`));
      });
    });
  }

  show({ table }) {
    return new Promise((resolve, reject) =>
      this.db.selectAll(table, (err, rows) => {
        if (!err) {
          resolve(rows);
        }
      })
    );
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
