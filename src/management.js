const vorpal = require("vorpal")();

const startManagement = function (library) {
  this.library = library;
  vorpal.command('addBook [attributes...]')
    .action(function (argument, callback) {
      library.addBook(argument.attributes);
      callback();
    })

  vorpal.command('show books')
    .action(function (argument, callback) {
      library.show({table: 'books'})
      callback();
    });

  vorpal.delimiter('library-management $')
    .show();

}

module.exports = {startManagement};