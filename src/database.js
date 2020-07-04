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

  updateBookAvailability(serial_no, curr_condition) {
    const schema = `update book_copies set is_available = '${curr_condition}' where serial_no='${serial_no}';`;
    this.database.run(schema);
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

  select(schema) {
    return new Promise((resolve, reject) => {
      this.database.get(schema, (err, row) => {
        if (err) reject(err);
        if (!row) reject('Book not available');
        resolve(row);
      });
    });
  }

  borrow(options) {
    let searchOptions = [];
    for (let option in options) {
      searchOptions.push(`${option}=='${options[option]}'`);
    }
    const schema = `select * from (${books_select}) where ${searchOptions.join( ' and ' )};`;

    return new Promise((resolve, reject) => {
      this.select(schema).then((row) => {
        const schema = `select * from book_copies where ISBN='${row.ISBN}' and is_available='true';`;

        this.select(schema)
          .then((available_copy) => {
            this.updateBookAvailability(available_copy.serial_no, 'false');
          })
          .then(() => resolve('borrow successful'))
          .catch((msg) => reject(`${msg}\n\nPlease take a look on available books by using command :-\n * show`));
      });
    });
  }

  selectAll(tableName, callback) {
    const schema = !tableName
      ? `${books_select};`
      : `select * from ${tableName};`;
    return this.database.all(schema, callback);
  }
}

module.exports = { Database };
