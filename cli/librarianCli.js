const Vorpal = require("vorpal");
const prompts = require("../src/prompt");

const giveLibrarian = function (library, sqlite) {
  const librarian = new Vorpal();

  librarian.command("add book").action(function (argument, callback) {
    this.prompt(prompts.addBook)
      .then((book) => library.addBook(sqlite, book))
      .then(callback)
      .catch(callback);
  });

  librarian.command("add copy").action(function (argument, callback) {
    this.prompt(prompts.addCopy)
      .then(({ isbn }) => library.addCopy(sqlite, isbn))
      .then(callback)
      .catch(callback);
  });

  librarian.command("show").action(function (argument, callback) {
    this.prompt(prompts.showTable)
      .then(({ table }) => library.show(sqlite, table))
      .then((rows) => {
        console.table(rows);
        callback();
      })
      .catch(callback);
  });

  librarian.command("search").action(function (argument, callback) {
    this.prompt(prompts.search)
      .then((info) => library.search(sqlite, info))
      .then((rows) => {
        console.table(rows);
        callback();
      })
      .catch(callback);
  });
  return librarian;
};

module.exports = { giveLibrarian };
