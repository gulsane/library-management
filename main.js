const Sqlite3 = require("sqlite3");
const {Library} = require("./src/library");
const {startCli} = require("./src/cliManager");
const {Sql} = require("./src/sql");

const main = function () {
  const db = new Sqlite3.Database("./library.db");
  const sql = Sql.init(db);
  const library = new Library();
  startCli(library, sql);
};

main();
