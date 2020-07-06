const DataBase = require("./database").Database;
const { getInsertQuery, createTransaction } = require("./actions");
const schemas = require("./schema");

class Library {
  constructor(path) {
    this.db = new DataBase(path);
  }

  async addBook({ isbn, title, category, author }) {
    const serial_number = await this.db.getSerialNumber();
    const serial_no = serial_number == null ? 1 : serial_number + 1;
    const updateBooks = getInsertQuery("books", [ isbn, title, category, author, ]);
    const updateCopies = getInsertQuery("book_copies", [isbn, serial_no, true]);
    const transaction = createTransaction([updateBooks, updateCopies]);
    return this.db.executeTransaction(transaction, { isbn, title, category, author, });
  }

  async addCopy(isbn) {
    if (await this.db.isIsbnAvailable(isbn)) {
      const serial_number = await this.db.getSerialNumber();
      const serial_no = serial_number == null ? 1 : serial_number + 1;
      const updateCopies = getInsertQuery("book_copies", [ isbn, serial_no, true, ]);
      const transaction = createTransaction([updateCopies]);
      return this.db.executeTransaction(transaction, { isbn });
    }
  }

  borrowBook(details) {
    return this.db.borrow(details);
  }

  returnBook(user, serial_no) {
    return this.db.updateBorrowedBook(user, serial_no);
  }

  show(table) {
    return new Promise((resolve, reject) =>
      this.db.selectAll(table, (err, rows) => {
        if (!err) {
          resolve(rows);
        }
      })
    );
  }

  static init(path) {
    const library = new Library(path);

    library.db.creatTable(schemas.books);
    library.db.creatTable(schemas.copies);
    library.db.creatTable(schemas.register);

    return library;
  }
}

module.exports = { Library };
