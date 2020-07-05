const vorpal = require('vorpal')();
const prompts = require('../src/prompt');

const startManagement = function (library) {
  vorpal.delimiter(vorpal.chalk.cyan('library-management $')).show();

  vorpal.command('add book').action(function (argument, callback) {
    this.prompt(prompts.addBook)
      .then((book) => library.addBook(book))
      .then(callback)
      .catch(callback);
  });

  vorpal.command('add copy').action(function (argument, callback) {
    this.prompt(prompts.addCopy)
      .then(({ isbn }) => library.addCopy(isbn))
      .then(callback)
      .catch(callback);
  });

  vorpal
    .command(
      'borrow <user_name>',
      'at least one optional command needed for borrow command'
    )
    .option('-i, --ISBN <book_isbn>')
    .option('-t, --title <book_name>')
    .validate((args) => {
      if (Object.values(args.options).length) return true;
      return 'missing arguments to borrow command';
    })
    .action(function (argument, callback) {
      library
        .borrowBook(argument)
        .then((msg) => {
          this.log(msg);
          callback();
        })
        .catch((msg) => {
          this.log(msg || 'borrow unsuccessful');
          callback();
        });
    });

  vorpal.command('return book').action(function (argument, callback) {
    this.prompt(prompts.returnBook)
      .then(({ user, serial_no }) => {
        library.returnBook(user, serial_no);
      })
      .then(callback)
      .catch(callback);
  });

  vorpal.command('show').action(function (argument, callback) {
    this.prompt(prompts.showTable)
      .then(({ table }) => library.show(table))
      .then((rows) => {
        console.table(rows);
        callback();
      })
      .catch(callback);
  });
  // .autocomplete(['books', 'book_copies', 'register'])
  // .action(function (args, callback) {
  //   library
  //     .show(args)
  //     .then((rows) => {
  //       console.table(rows);
  //       callback();
  //     })
  //     .catch((msg) => {
  //       this.log(msg);
  //       callback();
  //     });
  // });
};

module.exports = { startManagement };
