const Vorpal = require('vorpal');
const prompts = require('../src/prompt');

const giveBorrower = function (library, sqlite) {
  const {getUserId} = require("./libraryCli");
  const borrower = new Vorpal();

  borrower.command('borrow book').action(function (argument, callback) {
    console.log(getUserId);

    this.prompt(prompts.borrowBook)
      .then((details) => library.borrowBook(sqlite, details, getUserId()))
      .then(callback)
      .catch(callback);
  });

  borrower.command('return book').action(function (argument, callback) {
    this.prompt(prompts.returnBook)
      .then(({serial_no}) =>
        library.returnBook(sqlite, serial_no, getUserId())
      )
      .then(callback)
      .catch(callback);
  });

  borrower.command("show").action(function (argument, callback) {
    this.prompt(prompts.showTable)
      .then(({table}) => library.show(sqlite, table))
      .then((rows) => {
        console.table(rows);
        callback();
      })
      .catch(callback);
  });

  borrower.command("search").action(function (argument, callback) {
    this.prompt(prompts.search)
      .then((info) => library.search(sqlite, info))
      .then((rows) => {
        console.table(rows);
        callback();
      })
      .catch(callback);
  });

  return borrower;
};

module.exports = {giveBorrower};
