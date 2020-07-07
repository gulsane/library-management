const Vorpal = require('vorpal');
const prompts = require('../src/prompt');
const { toggle } = require('./libraryCli');

const giveBorrower = function (library,sqlite) {
  const borrower = new Vorpal();
  // borrower.use(toggle).delimiter('Library-Borrower-section $ ').show();

  borrower.command('borrow book').action(function (argument, callback) {
    this.prompt(prompts.borrowBook)
      .then((details) => library.borrowBook(sqlite, details))
      .then(callback)
      .catch(callback);
  });

  borrower.command('return book').action(function (argument, callback) {
    this.prompt(prompts.returnBook)
      .then(({ user, serial_no }) =>
        library.returnBook(sqlite, user, serial_no)
      )
      .then(callback)
      .catch(callback);
  });
  return borrower;
};

module.exports = { giveBorrower };
