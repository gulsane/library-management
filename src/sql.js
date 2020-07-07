const schemas = require("./schema");

class Sql {
  constructor(db) {
    this.db = db;
  }

  createTable(schema) {
    return new Promise((resolve, reject) => {
      this.db.run(schema, (err) => {
        if (err) reject(err);
        resolve({msg:'table created successfully'});
      });
    });
  }

  static init(db) {
    const sql = new Sql(db);

    sql.createTable(schemas.books);
    sql.createTable(schemas.copies);
    sql.createTable(schemas.register);

    return sql;
  }

  executeTransaction(transaction, msg) {
    return new Promise((resolve, reject) => {
      this.db.exec(transaction, (err) => {
        if (err) reject(err);
        resolve(msg);
      });
    });
  }

  getSerialNumber() {
    return new Promise((resolve, reject) => {
      this.db.get(
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
      this.db.all(`select * from books where ISBN='${ISBN}'`, (err, rows) => {
        if (rows.length === 0) reject(false);
        resolve(true);
      });
    });
  }

  getAll(schema, errMsg) {
    return new Promise((resolve, reject) => {
      this.db.all(schema, (err, row) => {
        if (err) reject(err);
        if (!row.length) reject(errMsg);
        resolve(row);
      });
    });
  }
}

module.exports = { Sql };
