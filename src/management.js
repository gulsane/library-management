const vorpal = require('vorpal')();

const startManagement = function (library) {
  vorpal.delimiter(vorpal.chalk.cyan('library-management $')).show();

  vorpal
    .command('addNewBook <ISBN> <title> <category> <author>')
    .action(function (argument, callback) {
      library
        .addBook(argument)
        .then((msg) => {
          this.log(msg);
          callback();
        })
        .catch((msg) => {
          this.log(msg);
          callback();
        });
    });

  vorpal.command('addCopy <ISBN>').action(function (argument, callback) {
    library
      .addCopy(argument)
      .then((msg) => {
        this.log(msg);
        callback();
      })
      .catch((msg) => {
        this.log(msg);
        callback();
      });
  });

  vorpal
    .command('borrow')
    .option('-i, --ISBN <book_isbn>')
    .option('-s, --serial_no <book_serial_no>')
    .option('-t, --title <book_name>')
    .action(function (argument, callback) {
      library
        .borrowBook(argument.options)
        .then((msg) => {
          this.log(msg);
          callback();
        })
        .catch((msg) => {
          this.log(msg);
          callback();
        });
    });

  vorpal
    .command('show <table>')
    .autocomplete(['books', 'book_copies', 'library_log'])
    .action(function (args, callback) {
      library
        .show(args)
        .then((rows) => {
          console.table(rows);
          callback();
        })
        .catch((msg) => {
          this.log(msg);
          callback();
        });
    });
};

module.exports = { startManagement };
