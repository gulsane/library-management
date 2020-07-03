const DataBase = require("./database").Database;
const { schema1, schema2, schema3 } = require("./tableSchema");

class Library {
  constructor(path) {
    this.db = new DataBase(path);
  }

  addBook(info) {
    console.log("from add books", info);
    this.db.getSerialNumber().then((data) => {
      const serial_no = data.serial_number == null ? 1 : data.serial_number + 1;
      const bookInfo = [info[0], serial_no, true];
      this.db.insertInTable("books", info);
      this.db.insertInTable("book_copies", bookInfo);
    });
  }

  show({ table }) {
    this.db.selectAll(`select * from ${table};`, (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        console.log();
        console.table(rows);
      }
    });
  }

  static init(path) {
    const library = new Library(path);

    library.db.creatTable(schema1);
    library.db.creatTable(schema2);
    library.db.creatTable(schema3);

    return library;
  }
}

module.exports = { Library };
