const Sqlite = require('sqlite3');

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

  selectAll(tableName, callback) {
    const schema = `select * from ${tableName};`;
    return this.database.all(schema, callback);
  }
}

module.exports = { Database };
