const vorpal = require('vorpal')();

const startManagement = function (library) {
  vorpal.delimiter(vorpal.chalk.cyan('library-management $')).show();

  vorpal
    .command('addBook <ISBN> <title> <category> <author>')
    .action(function (argument, callback) {
      library.addBook(argument).then((msg) => {
        this.log(msg);
        callback();
      });
    });

  vorpal.command('show <table>').action(function (args, callback) {
    library.show(args).then((rows) => {
      console.table(rows);
      callback();
    });
  });
};

module.exports = { startManagement };
