const vorpal = require('vorpal')();
const prompts = require('../src/prompt');

const startCli = function (library, sqlite) {
  vorpal.delimiter(vorpal.chalk.cyan('library $ ')).show();

  vorpal.command('add book').action(function (argument, callback) {
    this.prompt(prompts.addBook)
      .then((book) => library.addBook(sqlite, book))
      .then(callback)
      .catch(callback);
  });

  vorpal.command('add copy').action(function (argument, callback) {
    this.prompt(prompts.addCopy)
      .then(({ isbn }) => library.addCopy(sqlite, isbn))
      .then(callback)
      .catch(callback);
  });

  vorpal.command('borrow book').action(function (argument, callback) {
    this.prompt(prompts.borrowBook)
      .then((details) => library.borrowBook(sqlite, details))
      .then(callback)
      .catch(callback);
  });

  vorpal.command('return book').action(function (argument, callback) {
    this.prompt(prompts.returnBook)
      .then(({ user, serial_no }) => library.returnBook(sqlite, user, serial_no))
      .then(callback)
      .catch(callback);
  });

  vorpal.command('show').action(function (argument, callback) {
    this.prompt(prompts.showTable)
      .then(({ table }) => library.show(sqlite, table))
      .then((rows) => {
        console.table(rows);
        callback();
      })
      .catch(callback);
  });

  vorpal.command("search").action(function (argument, callback) {
    this.prompt(prompts.search)
      .then((info) => library.search(sqlite, info))
      .then((rows) => {
        console.table(rows);
        callback();
      })
      .catch(callback);
  })
};

module.exports = { startCli };
