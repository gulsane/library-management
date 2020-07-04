const DataBase = require("./database").Database;
const {
  books_table_schema,
  copies_table_schema,
  log_table_schema,
} = require("./schema");
const { resolve } = require("path");

class Library {
  constructor(path) {
    this.db = new DataBase(path);
  }

  addBook({ ISBN, title, category, author }) {
    return new Promise((resolve, reject) => {
      this.db.getSerialNumber().then((serial_number) => {
        const serial_no = serial_number == null ? 1 : serial_number + 1;
        this.db
          .insertInTable("books", [ISBN, title, category, author])
          .then(() =>
            this.db.insertInTable("book_copies", [ISBN, serial_no, true])
          )
          .then(() => resolve("OK"))
          .catch((msg) => reject(`error happened with msg : ${msg}`));
      });
    });
  }

  addCopy({ ISBN }) {
    return new Promise((resolve, reject) => {
      this.db.getSerialNumber().then((serial_number) => {
        this.db
          .isIsbnAvailable(ISBN)
          .then(() => {
            const serial_no = serial_number == null ? 1 : serial_number + 1;
            this.db
              .insertInTable("book_copies", [ISBN, serial_no, true])
              .then(() => resolve("OK"));
          })
          .catch(() => reject("ISBN not available"));
      });
    });
  }

  borrowBook(options) {
    return new Promise((resolve, reject) => {
      resolve(options);
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

    library.db.creatTable(books_table_schema);
    library.db.creatTable(copies_table_schema);
    library.db.creatTable(log_table_schema);

    return library;
  }
}

module.exports = { Library };
