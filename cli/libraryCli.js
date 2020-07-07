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

  ourLibrary.command("login").action(function (argument, callback) {
    this.prompt(prompts.login)
      .then(({ domain }) => interfaceInstances[domain].show())
      .then(()=>callback())
      .catch(()=>callback());
  });

  interfaceInstances = {
    ourLibrary,
    borrower: giveBorrower(library, sqlite)
      .use(logout)
      .delimiter("Library-Borrower-section $ ")
      .show(),
    librarian: giveLibrarian(library, sqlite)
      .use(logout)
      .delimiter("Library-librarian-section $ ")
      .show(),
  };
};

module.exports = { startCli };
