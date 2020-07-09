const Vorpal = require('vorpal');
const prompts = require('../src/prompt');
let interfaceInstances;
let userId;

const getUserId = () => userId;

const logout = function (vorpal) {
  vorpal.command('logout').action(function (args, cb) {
    interfaceInstances.main.show();
    cb();
  });
  return vorpal;
};

const addLogin = function (vorpal, library, sqlite) {
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

const addSignIn = function (vorpal, library, sqlite) {
  vorpal.command('signIn').action(function (argument, callback) {
    this.prompt(prompts.signIn)
      .then((details) => library.registerUser(sqlite, details))
      .then(callback)
      .catch(callback);
  });
};

const addBook = function (vorpal, library, sqlite) {
  vorpal.command('add book').action(function (argument, callback) {
    this.prompt(prompts.addBook)
      .then((book) => library.addBook(sqlite, book))
      .then(callback)
      .catch(callback);
  });
};

const addCopy = function (vorpal, library, sqlite) {
  vorpal.command('add copy').action(function (argument, callback) {
    this.prompt(prompts.addCopy)
      .then(({ isbn }) => library.addCopy(sqlite, isbn))
      .then(callback)
      .catch(callback);
  });
};

const addShowTables = function (vorpal, library, sqlite) {
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

const addSearch = function (vorpal, library, sqlite) {
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

const addBorrowBook = function (vorpal, library, sqlite) {
  vorpal.command('borrow book').action(function (argument, callback) {
    this.prompt(prompts.borrowBook)
      .then((details) => library.borrowBook(sqlite, details, getUserId()))
      .then(callback)
      .catch(callback);
  });
};

const addReturnBook = function (vorpal, library, sqlite) {
  vorpal.command('return book').action(function (argument, callback) {
    this.prompt(prompts.returnBook)
      .then(({ serial_no }) =>
        library.returnBook(sqlite, serial_no, getUserId())
      )
      .then(callback)
      .catch(callback);
  });
};

const createMainInterface = function (library, sqlite) {
  const vorpal = new Vorpal();
  vorpal.use(logout);
  addLogin(vorpal, library, sqlite);
  addSignIn(vorpal, library, sqlite);

  vorpal.delimiter(vorpal.chalk.yellow('Library $ '));
  return vorpal;
};

const createLibrarianInterface = function (library, sqlite) {
  const vorpal = new Vorpal();
  vorpal.use(logout);
  addBook(vorpal, library, sqlite);
  addCopy(vorpal, library, sqlite);
  addShowTables(vorpal, library, sqlite);
  addSearch(vorpal, library, sqlite);

  vorpal.delimiter(vorpal.chalk.cyan('Librarian $ '));
  return vorpal;
};

const createBorrowerInterface = function (library, sqlite) {
  const vorpal = new Vorpal();
  vorpal.use(logout);
  addBorrowBook(vorpal, library, sqlite);
  addReturnBook(vorpal, library, sqlite);
  addSearch(vorpal, library, sqlite);

  vorpal.delimiter(vorpal.chalk.cyan('Borrower $ '));
  return vorpal;
};

const startCli = function (library, sqlite) {
  interfaceInstances = {
    main: createMainInterface(library, sqlite),
    borrower: createBorrowerInterface(library, sqlite),
    librarian: createLibrarianInterface(library, sqlite),
  };
  
  interfaceInstances.main.show()
};

module.exports = { startCli };
 