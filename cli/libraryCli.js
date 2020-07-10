const {librarian} = require('../config');
const Vorpal = require('vorpal');
const prompts = require('../src/prompt');

const Sqlite3 = require('sqlite3');
const { Sql } = require('../src/sql');
const db = new Sqlite3.Database('./library.db');
let sqlite;

const { Library } = require('../src/library');
const library = new Library();

let interfaceInstances;
let userId;

const getUserId = () => userId;

const logout = function (vorpal) {
  vorpal.command('logout').action(function (argument, callback) {
    interfaceInstances.main.show();
    callback();
  });
  return vorpal;
};

const addLogin = function (vorpal) {
  vorpal.command('login').action(function (argument, callback) {
    this.prompt(prompts.login)
      .then(({ id, password }) =>
        library.validatePassword(sqlite, id, password)
      )
      .then(({ id, domain }) => {
        interfaceInstances[domain].show();
        userId = id;
      })
      .then(callback)
      .catch(callback);
  });
};

const addSignIn = function (vorpal) {
  vorpal.command('signIn').action(function (argument, callback) {
    this.prompt(prompts.signIn)
      .then((details) => library.registerUser(sqlite, details))
      .then(callback)
      .catch(callback);
  });
};

const addBook = function (vorpal) {
  vorpal.command('add book').action(function (argument, callback) {
    this.prompt(prompts.addBook)
      .then((book) => library.addBook(sqlite, book))
      .then(callback)
      .catch(callback);
  });
};

const addCopy = function (vorpal) {
  vorpal.command('add copy').action(function (argument, callback) {
    this.prompt(prompts.addCopy)
      .then(({ isbn }) => library.addCopy(sqlite, isbn))
      .then(callback)
      .catch(callback);
  });
};

const addShowTables = function (vorpal) {
  vorpal.command('show').action(function (argument, callback) {
    this.prompt(prompts.showTable)
      .then(({ table }) => library.show(sqlite, table))
      .then((rows) => {
        console.table(rows);
        callback();
      })
      .catch(callback);
  });
};

const addSearch = function (vorpal) {
  vorpal.command('search').action(function (argument, callback) {
    this.prompt(prompts.search)
      .then((info) => library.search(sqlite, info))
      .then((rows) => {
        console.table(rows);
        callback();
      })
      .catch(callback);
  });
};

const addBorrowBook = function (vorpal) {
  vorpal.command('borrow book').action(function (argument, callback) {
    this.prompt(prompts.borrowBook)
      .then((details) => library.borrowBook(sqlite, details, getUserId()))
      .then(callback)
      .catch(callback);
  });
};

const addReturnBook = function (vorpal) {
  vorpal.command('return book').action(function (argument, callback) {
    this.prompt(prompts.returnBook)
      .then(({ serialNo }) => library.returnBook(sqlite, serialNo, getUserId()))
      .then(callback)
      .catch(callback);
  });
};

const addActivity = function (vorpal) {
  vorpal.command('my activity').action(function (argument, callback) {
    this.prompt([])
      .then(() => library.showHistory(sqlite, getUserId()))
      .then((rows) => {
        console.table(rows);
        callback();
      })
      .catch(callback);
  });
};

const createMainInterface = function () {
  const vorpal = new Vorpal();
  addLogin(vorpal);
  addSignIn(vorpal);

  library.registerUser(sqlite, librarian, 'librarian');

  vorpal.delimiter(vorpal.chalk.yellow('Library $ '));
  return vorpal;
};

const createLibrarianInterface = function () {
  const vorpal = new Vorpal();
  vorpal.use(logout);
  addBook(vorpal);
  addCopy(vorpal);
  addShowTables(vorpal);
  addSearch(vorpal);

  vorpal.delimiter(vorpal.chalk.cyan('Librarian $ '));
  return vorpal;
};

const createBorrowerInterface = function () {
  const vorpal = new Vorpal();
  vorpal.use(logout);
  addBorrowBook(vorpal);
  addReturnBook(vorpal);
  addSearch(vorpal);
  addActivity(vorpal);

  vorpal.delimiter(vorpal.chalk.cyan('Borrower $ '));
  return vorpal;
};

const createTablesInDb = async function () {
  sqlite = await Sql.init(db);
  return sqlite;
}

const startCli = async function () {

  await createTablesInDb();

  interfaceInstances = {
    main: createMainInterface(),
    borrower: createBorrowerInterface(),
    librarian: createLibrarianInterface(),
  };

  interfaceInstances.main.show();
};

module.exports = { startCli };
