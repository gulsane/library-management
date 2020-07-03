const Sqlite = require('sqlite3');

class Database {
  constructor (path) {
    this.path = path;
    this.database = new Sqlite.Database(path);
  }

  creatTable(schema) {
    return this.database.run(schema, (err) => err && console.log("error in creation", err));
  }

  insertInTable(table, values) {
    console.log("inserting into database ", table, values);
    const schema = `insert into ${table} values (`;
    const valueAsString = values.map((e) => `'${e}'`).join(',');
    return this.database.run(schema.concat(valueAsString, ');'), (err) => {
      if (err) console.log(err);
    });
  }

  selectAll(schema, callback) {
    return this.database.all(schema, callback);
  }
}

module.exports = {Database};
