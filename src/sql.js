const schemas = require("./schema");

class Sql {
  constructor(db) {
    this.db = db;
  }

  createTable(schema) {
    return new Promise((resolve, reject) => {
      this.db.run(schema, (err) => {
        if (err) reject(err);
        resolve({ msg: 'Table created successfully.' });
      });
    });
  }

  static init(db) {
    const sql = new Sql(db);

    sql.createTable(schemas.books);
    sql.createTable(schemas.copies);
    sql.createTable(schemas.borrowActivity);
    sql.createTable(schemas.returnActivity);
    sql.createTable(schemas.members);

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

  runQuery(query, msg) {
    return new Promise((resolve, reject) => {
      this.db.run(query, (err) => {
        if (err) reject(err);
        resolve(msg);
      });
    });
  }

  getAll(query, errMsg) {
    return new Promise((resolve, reject) => {
      this.db.all(query, (err, row) => {
        if (err) reject(err);
        if (!row.length) reject(errMsg);
        resolve(row);
      });
    });
  }

  get(query, errMsg) {
    return new Promise((resolve, reject) => {
      this.db.get(query, (err, row) => {
        if (err) reject(err);
        if (!row) reject(errMsg);
        resolve(row);
      });
    });
  }
}

module.exports = { Sql };
