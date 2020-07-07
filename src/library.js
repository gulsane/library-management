const {
  getInsertQuery,
  createTransaction,
  selectBooks,
  selectAvailableCopies,
  updateBookState,
  selectBorrowedCopy,
  selectAllBooks
} = require('./actions');

class Library {
  async addBook(client, book) {
    const { isbn, title, category, author } = book;
    const serial_number = await client.getSerialNumber();
    const serial_no = serial_number == null ? 1 : serial_number + 1;
    const updateBooks = getInsertQuery('books', [
      isbn,
      title,
      category,
      author,
    ]);
    const updateCopies = getInsertQuery('book_copies', [isbn, serial_no, true]);
    const transaction = createTransaction([updateBooks, updateCopies]);
    return client.executeTransaction(transaction, {
      isbn,
      title,
      category,
      author,
    });
  }

  async addCopy(client, isbn) {
    if (await client.isIsbnAvailable(isbn)) {
      const serial_number = await this.db.getSerialNumber();
      const serial_no = serial_number == null ? 1 : serial_number + 1;
      const updateCopies = getInsertQuery('book_copies', [
        isbn,
        serial_no,
        true,
      ]);
      const transaction = createTransaction([updateCopies]);
      return client.executeTransaction(transaction, { isbn });
    }
  }

  async borrowBook(client, bookInfo) {
    const { user, info, ISBN, title } = bookInfo;
    const availableBooksQuery = selectBooks(info, ISBN, title);
    const [row] = await client.getAll(availableBooksQuery, {
      msg: 'Book not available in library',
    });
    const availableCopyQuery = selectAvailableCopies(row.ISBN);
    const [bookCopy] = await client.getAll(availableCopyQuery, {
      msg: 'Currently no copy available of this book',
    });
    const updateTable = updateBookState(bookCopy.serial_no, false);
    const addTable = getInsertQuery('register', [
      bookCopy.serial_no,
      'borrow',
      user,
    ]);
    const transaction = createTransaction([updateTable, addTable]);
    return client.executeTransaction(transaction, {
      msg: 'borrow successful',
      title: row.title,
      user,
      serial_no: bookCopy.serial_no,
    });
  }

  async returnBook(client, user, serial_no) {
    const borrowedBookQuery = selectBorrowedCopy(serial_no);
    const [borrowedBook] = await client.getAll(borrowedBookQuery, {
      msg: 'Book was not taken from library',
    });
    const updateTable = updateBookState(borrowedBook.serial_no, true);
    const addTable = getInsertQuery('register', [
      borrowedBook.serial_no,
      'return',
      user,
    ]);
    const transaction = createTransaction([updateTable, addTable]);
    return client.executeTransaction(transaction, {
      msg: 'return successful',
      user,
      serial_no: borrowedBook.serial_no,
    });
  }

  async show(client, table) {
    const bookQuery = table === 'all books' ? `${selectAllBooks()};` : `select * from ${table};`;
    const errMsg = {msg: 'Table is empty'};
    return await client.getAll(bookQuery, errMsg);
  }

  async search(client, info) {
    const booksQuery = selectBooks(info.key, info[info.key]);
    const errMsg = { msg: `${info.key} ${info[info.key]} not matched` };
    return await client.getAll(booksQuery, errMsg);
  }
}

module.exports = { Library };
