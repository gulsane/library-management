const Vorpal = require('vorpal');
const prompts = require('../src/prompt');
const { toggle } = require('./libraryCli');

const giveLibrarian = function (library,sqlite) {
  const librarian = new Vorpal();
  // librarian.use(toggle).delimiter('Library-librarian-section $ ').show();

  librarian.command('add book').action(function (argument, callback) {
    this.prompt(prompts.addBook)
      .then((book) => library.addBook(sqlite, book))
      .then(callback)
      .catch(callback);
  });

  librarian.command('add copy').action(function (argument, callback) {
    this.prompt(prompts.addCopy)
      .then(({ isbn }) => library.addCopy(sqlite, isbn))
      .then(callback)
      .catch(callback);
  });
  return librarian
};

module.exports = { giveLibrarian };
