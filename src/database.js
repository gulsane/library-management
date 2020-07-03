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
        `select * from books where ISBN=${ISBN}`,
        (err, rows) => {
          if (rows.length === 0) reject(false);
          resolve(true);
        }
      );
    });
  }

  selectAll(tableName, callback) {
    const schema = !tableName ? books_select : `select * from ${tableName};`;
    return this.database.all(schema, callback);
  }
}

module.exports = { Database };
