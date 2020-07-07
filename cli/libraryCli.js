const Vorpal = require("vorpal");
const prompts = require("../src/prompt");
const { giveBorrower } = require("../cli/borrowerCli");
const { giveLibrarian } = require("../cli/librarianCli");
let interfaceInstances;

const validatePassword = function ({ domain, userName, password }) {
  const librarian = { userName: "vaishnavi", password: "password" };
  if (domain == "borrower") {
    return domain;
  }
  if (userName == librarian.userName && password == librarian.password) {
    return domain;
  }
  return "ourLibrary";
};

const logout = function (vorpal) {
  vorpal.command("logout").action(function (args, cb) {
    interfaceInstances.ourLibrary.show();
    cb();
  });
  return vorpal;
};

const startCli = function (library, sqlite) {
  const ourLibrary = new Vorpal();
  ourLibrary.delimiter("library $ ").show();

  ourLibrary.command("login").action(function (argument, callback) {
    this.prompt(prompts.login)
      .then(validatePassword)
      .then(( domain ) => interfaceInstances[domain].show())
      .then(() => callback())
      .catch(() => callback());
  });

  interfaceInstances = {
    ourLibrary,
    borrower: giveBorrower(library, sqlite)
      .use(logout)
      .delimiter("Borrower-section $ ")
      .show(),
    librarian: giveLibrarian(library, sqlite)
      .use(logout)
      .delimiter("Librarian-section $ ")
      .show(),
  };
};

module.exports = { startCli };
