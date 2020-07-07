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
