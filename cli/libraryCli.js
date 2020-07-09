const Vorpal = require("vorpal");
const prompts = require("../src/prompt");
const { giveBorrower } = require("../cli/borrowerCli");
const { giveLibrarian } = require("../cli/librarianCli");
let interfaceInstances;

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

  ourLibrary.command("sign in").action(function (argument, callback) {
    this.prompt(prompts.signIn)
      .then((details)=>library.registerUser(sqlite,details))
      .then(callback)
      .catch(callback);
  });

  ourLibrary.command("login").action(function (argument, callback) {
    this.prompt(prompts.login)
      .then(({id,password})=>library.validatePassword(sqlite,id,password))
      .then((domain) => {interfaceInstances[domain].show()})
      .then(callback)
      .catch(callback)
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
