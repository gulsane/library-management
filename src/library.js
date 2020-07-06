const DataBase = require("./database").Database;
const {
  getInsertQuery,
  createTransaction,
  selectBooks,
  selectAvailableCopies,
  updateBookState,
  selectBorrowedCopy,
} = require("./actions");
const schemas = require("./schema");

class Library {
  constructor(path) {
    this.db = new DataBase(path);
  }

  async addBook({ isbn, title, category, author }) {
    const serial_number = await this.db.getSerialNumber();
    const serial_no = serial_number == null ? 1 : serial_number + 1;
    const updateBooks = getInsertQuery("books", [
      isbn,
      title,
      category,
      author,
    ]);
    const updateCopies = getInsertQuery("book_copies", [isbn, serial_no, true]);
    const transaction = createTransaction([updateBooks, updateCopies]);
    return this.db.executeTransaction(transaction, {
      isbn,
      title,
      category,
      author,
    });
  }

  async addCopy(isbn) {
    if (await this.db.isIsbnAvailable(isbn)) {
      const serial_number = await this.db.getSerialNumber();
      const serial_no = serial_number == null ? 1 : serial_number + 1;
      const updateCopies = getInsertQuery("book_copies", [
        isbn,
        serial_no,
        true,
      ]);
      const transaction = createTransaction([updateCopies]);
      return this.db.executeTransaction(transaction, { isbn });
    }
  }

  async borrowBook({ user, info, ISBN, title }) {
    const availableBooksQuery = selectBooks(info, ISBN, title);
    const rows = await this.db.getAll(availableBooksQuery);
    const availableCopyQuery = selectAvailableCopies(rows.ISBN);
    const bookCopy = await this.db.getAll(availableCopyQuery);
    const updateTable = updateBookState(bookCopy.serial_no, false);
    const addTable = getInsertQuery("register", [
      bookCopy.serial_no,
      "borrow",
      user,
    ]);
    const transaction = createTransaction([updateTable, addTable]);
    return this.db.executeTransaction(transaction, {
      msg: "borrow successful",
      title: rows.title,
      user,
      serial_no: bookCopy.serial_no,
    });
  }

  async returnBook(user, serial_no) {
    const borrowedBookQuery = selectBorrowedCopy(serial_no);
    const borrowedBook = await this.db.getAll(borrowedBookQuery);
    const updateTable = updateBookState(borrowedBook.serial_no, true);
    const addTable = getInsertQuery("register", [
      borrowedBook.serial_no,
      "return",
      user,
    ]);
    const transaction = createTransaction([updateTable, addTable]);
    return this.db.executeTransaction(transaction, {
      msg: "return successful",
      user,
      serial_no: borrowedBook.serial_no,
    });
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
