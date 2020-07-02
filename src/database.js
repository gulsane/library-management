const Sqlite = require('sqlite3');

class Database {
  constructor(path) {
    this.path = path;
    this.database = new Sqlite3.Database(path);
  }
  
  creatTable(schema) {
    return this.database.run(schema);
  }

  insertInTable(table, values) {
    const schema = `insert into ${table} values (`;
    const valueAsString = Object.value(values).map((e) => `'${e}'`).join(',');
    return this.database.run(schema.concat(valueAsString), ');');
  }

}

module.exports={Database}