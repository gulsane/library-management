const Vorpal = require('vorpal');
const prompts = require('../src/prompt');
const { giveBorrower } = require('../cli/borrowerCli');
const { giveLibrarian } = require('../cli/librarianCli');
// const library = require('../src/library');
let instances;

const toggle = function (vorpal) {
  vorpal.command('toggle <instance>').action(function (args, cb) {
    instances[args.instance].show();
    cb();
  });
  return vorpal;
};

const ourLibrary = new Vorpal();
ourLibrary.use(toggle).delimiter('library $ ').show();

const startCli = function (library, sqlite) {
  new_library = library;

  ourLibrary.command('show').action(function (argument, callback) {
    this.prompt(prompts.showTable)
      .then(({ table }) => library.show(sqlite, table))
      .then((rows) => {
        console.table(rows);
        callback();
      })
      .catch(callback);
  });

  ourLibrary.command('search').action(function (argument, callback) {
    this.prompt(prompts.search)
      .then((info) => library.search(sqlite, info))
      .then((rows) => {
        console.table(rows);
        callback();
      })
      .catch(callback);
  });

  instances = {
    ourLibrary,
    borrower: giveBorrower(library,sqlite)
      .use(toggle)
      .delimiter('Library-Borrower-section $ ')
      .show(),
    librarian: giveLibrarian(library,sqlite)
      .use(toggle)
      .delimiter('Library-librarian-section $ ')
      .show(),
  };
};

module.exports = { startCli, toggle };
