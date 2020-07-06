const Sqlite = require("sqlite3");
const { books_select } = require("./schema");
const { createTransaction } = require("./actions");
class Database {
  constructor(path) {
    this.path = path;
    this.database = new Sqlite.Database(path);
  }

  creatTable(schema) {
    return new Promise((resolve, reject) => {
      this.database.run(schema, (err) => {
        if (err) reject(err);
        resolve("OK");
      });
    });
  }

  executeTransaction(transaction, msg) {
    return new Promise((resolve, reject) => {
      this.database.exec(transaction, (err) => {
        if (err) reject(err);
        resolve(msg);
      });
    });
  }

  insertInTable(table, values) {
    const schema = `insert into ${table} values (`;
    const valueAsString = values.map((e) => `'${e}'`).join(",");
    return new Promise((resolve, reject) => {
      this.database.run(schema.concat(valueAsString, ");"), (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  getSerialNumber() {
    return new Promise((resolve, reject) => {
      this.database.get(
        "SELECT MAX(serial_no) as serial_number from book_copies;",
        (err, row) => {
          if (row) resolve(row.serial_number);
          reject(err);
        }
      );
    });
  }

  isIsbnAvailable(ISBN) {
    return new Promise((resolve, reject) => {
      this.database.all(
        `select * from books where ISBN='${ISBN}'`,
        (err, rows) => {
          if (rows.length === 0) reject(false);
          resolve(true);
        }
      );
    });
  }

  getAll(schema) {
    return new Promise((resolve, reject) => {
      this.database.get(schema, (err, row) => {
        if (err) reject(err);
        if (!row) reject("Book not found");
        resolve(row);
      });
    });
  }

  getAvailableBooksQuery(info, isbn, title) {
    return `select * from (${books_select}) where ${info}=='${isbn || title}';`;
  }

  borrow({ user, info, ISBN, title }) {
    const availableBooksQuery = this.getAvailableBooksQuery(info, ISBN, title);
    return new Promise((resolve, reject) => {
      this.getAll(availableBooksQuery).then((row) => {
        const isBookAvailable = `select * from book_copies where ISBN='${row.ISBN}' and is_available='true';`;

        this.getAll(isBookAvailable).then((book_copy) => {
          const updateTable = `update book_copies set is_available = 'false' where serial_no='${book_copy.serial_no}'`;
          const addTable = `insert into register values(${book_copy.serial_no},'borrow','${user}')`;
          const transaction = createTransaction([updateTable, addTable]);
          this.executeTransaction(transaction, {
            msg: "borrow successful",
            title: row.title,
            user,
            serial_no: book_copy.serial_no,
          });
        });
      });
    });
  }

  updateBorrowedBook(user, serial_no) {
    const schema = `select * from book_copies where serial_no='${serial_no}' and is_available='false';`;
    return new Promise((resolve, reject) => {
      this.getAll(schema).then((row) => {
        const updateTable = `update book_copies set is_available = 'true' where serial_no='${row.serial_no}'`;
        const addTable = `insert into register values(${row.serial_no},'return','${user}');`;
        const transaction = createTransaction([updateTable, addTable]);
        this.executeTransaction(transaction, {
          msg: "return successful",
          user,
          serial_no: row.serial_no,
        });
      });
    });
  }

  selectAll(table, callback) {
    const schema =
      table === "all books" ? `${books_select};` : `select * from ${table};`;
    return this.database.all(schema, callback);
  }
}

module.exports = { Database };
