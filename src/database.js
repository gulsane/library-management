const Sqlite = require('sqlite3');
const { books_select } = require('./schema');

class Database {
  constructor(path) {
    this.path = path;
    this.database = new Sqlite.Database(path);
  }

  creatTable(schema) {
    return new Promise((resolve, reject) => {
      this.database.run(schema, (err) => {
        if (err) reject(err);
        resolve('OK');
      });
    });
  }

  insertInTable(table, values) {
    const schema = `insert into ${table} values (`;
    const valueAsString = values.map((e) => `'${e}'`).join(',');
    return new Promise((resolve, reject) => {
      this.database.run(schema.concat(valueAsString, ');'), (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  getSerialNumber() {
    return new Promise((resolve, reject) => {
      this.database.get(
        'SELECT MAX(serial_no) as serial_number from book_copies;',
        (err, row) => {
          if (err) reject(err);
          resolve(row.serial_number);
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
        if (!row) reject('Book not found');
        resolve(row);
      });
    });
  }

  createTransaction(operations) {
    const operationsList = operations.join(';');
    const transaction = `BEGIN TRANSACTION; ${operationsList}; COMMIT;`;
    return transaction;
  }

  getAvailableBooksQuery(options) {
    let searchOptions = [];
    for (let option in options) {
      searchOptions.push(`${option}=='${options[option]}'`);
    }
    return `select * from (${books_select}) where ${searchOptions.join(
      ' and '
    )};`;
  }

  borrow(user_name, options) {
    const availableBooksQuery = this.getAvailableBooksQuery(options);
    return new Promise((resolve, reject) => {
      this.getAll(availableBooksQuery).then((row) => {
        const isBookAvailable = `select * from book_copies where ISBN='${row.ISBN}' and is_available='true';`;

        this.getAll(isBookAvailable)
          .then((book_copy) => {
            const updateTable = `update book_copies set is_available = 'false' where serial_no='${book_copy.serial_no}'`;
            const addTable = `insert into register values(${book_copy.serial_no},'borrow','${user_name}');`;
            this.createTransaction([
              this.database.run(updateTable),
              this.database.run(addTable),
            ]);
            return `${book_copy.serial_no}`;
          })
          .then((serial_no) =>
            resolve(
              `borrow successful: {title : ${row.title}, user : ${user_name}, serial_no : ${serial_no}}`
            )
          )
          .catch((err) =>
            reject(
              err ||
                'Book not available\n\nPlease take a look on available books by using command :-\n * show'
            )
          );
      });
    });
  }

  updateBorrowedBook(user_name, serial_no) {
    const schema = `select * from book_copies where serial_no='${serial_no}' and is_available='false';`;
    return new Promise((resolve, reject) => {
      this.getAll(schema)
        .then((row) => {
          const updateTable = `update book_copies set is_available = 'true' where serial_no='${row.serial_no}'`;
          const addTable = `insert into register values(${row.serial_no},'return','${user_name}');`;
          this.createTransaction([
            this.database.run(updateTable),
            this.database.run(addTable),
          ]);
          resolve(
            `return successful:{user_name : ${user_name},serial_no : ${row.serial_no}}`
          );
        })
        .catch(() => reject('Book was not taken'));
    });
  }

  selectAll(table, callback) {
    const schema =
      table === 'all books' ? `${books_select};` : `select * from ${table};`;
    return this.database.all(schema, callback);
  }
}

module.exports = { Database };
