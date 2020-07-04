const vorpal = require("vorpal")();

const startManagement = function (library) {
  vorpal.delimiter(vorpal.chalk.cyan("library-management $")).show();

  vorpal
    .command("add new book <ISBN> <title> <category> <author>")
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

  vorpal.command("add copy <ISBN>").action(function (argument, callback) {
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
    .command(
      "borrow <user_name>",
      "at least one optional command needed for borrow command"
    )
    .option("-i, --ISBN <book_isbn>")
    .option("-t, --title <book_name>")
    .validate((args) => {
      if (Object.values(args.options).length) return true;
      return "missing arguments to borrow command";
    })
    .action(function (argument, callback) {
      library
        .borrowBook(argument)
        .then((msg) => {
          this.log(msg);
          callback();
        })
        .catch((msg) => {
          this.log(msg || "borrow unsuccessful");
          callback();
        });
    });

  vorpal
    .command(
      "return <user_name> <serial_no>",
      "serial number needed to return a book"
    )
    .action(function (argument, callback) {
      library
        .returnBook(argument)
        .then((msg) => {
          this.log(msg);
          callback();
        })
        .catch((msg) => {
          this.log(msg || "return unsuccessful");
          callback();
        });
    });

  vorpal
    .command("show [table]")
    .autocomplete(["books", "book_copies", "register"])
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
