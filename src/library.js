const {
  getInsertQuery,
  createTransaction,
  selectBooks,
  selectAvailableCopies,
  updateBookState,
  selectBorrowedCopy,
  selectAllBooks,
  getInsertQueryForBook,
  selectAvailableBooks,
  getMemberQuery,
  getRegisterQuery,
  getTransaction,
} = require('./actions');

class Library {
  async addBook(client, book) {
    const { isbn, title, category, author } = book;
    const updateBooks = getInsertQuery('books', [
      isbn,
      title,
      category,
      author,
    ]);
    const updateCopies = getInsertQueryForBook([isbn, true]);
    const transaction = createTransaction([updateBooks, updateCopies]);
    return client.executeTransaction(transaction, {
      msg: 'Book registered successfully.',
      isbn,
      title,
      category,
      author,
    });
  }

  async isIsbnAvailable(client, isbn) {
    const bookQuery = selectBooks(`isbn`, isbn);
    return await client.getAll(bookQuery, { msg: `${isbn} not available.` });
  }

  async addCopy(client, isbn) {
    if (await this.isIsbnAvailable(client, isbn)) {
      const updateCopies = getInsertQueryForBook([isbn, true]);
      const transaction = createTransaction([updateCopies]);
      return client.executeTransaction(transaction, {
        msg: 'Copy registered successfully.',
        isbn,
      });
    }
  }

  async borrowBook(client, bookInfo, userId) {
    const { key, isbn, title } = bookInfo;
    const availableBooksQuery = selectBooks(key, isbn, title);
    const [row] = await client.getAll(availableBooksQuery, {
      msg: 'Book unavailable.',
    });
    const availableCopyQuery = selectAvailableCopies(row.isbn);
    const [bookCopy] = await client.getAll(availableCopyQuery, {
      msg: 'Currently unavailable.',
    });
    const updateTable = updateBookState(bookCopy.serialNo, false);
    const currentDate = new Date();
    const addTable = getRegisterQuery('register', [
      userId,
      'borrow',
      bookCopy.serialNo,
      currentDate.toDateString(),
      new Date(currentDate.valueOf() + 864000000).toDateString(),
      null,
    ]);
    const transaction = createTransaction([updateTable, addTable]);
    return client.executeTransaction(transaction, {
      msg: 'borrowed successfully.',
      title: row.title,
      userId,
      serialNo: bookCopy.serialNo,
    });
  }

  async returnBook(client, serialNo, userId) {
    const borrowedBookQuery = selectBorrowedCopy(serialNo);
    const [borrowedBook] = await client.getAll(borrowedBookQuery, {
      msg: 'Book was not taken from library.',
    });
    const updateTable = updateBookState(borrowedBook.serialNo, true);
    const [transactionDetail] = await client.getAll(getTransaction(serialNo));
    const addTable = getRegisterQuery('register', [
      userId,
      'return',
      borrowedBook.serialNo,
      transactionDetail.borrowDate,
      transactionDetail.dueDate,
      new Date().toDateString(),
    ]);
    const transaction = createTransaction([updateTable, addTable]);
    return client.executeTransaction(transaction, {
      msg: 'returned successfully.',
      userId,
      serialNo: borrowedBook.serialNo,
    });
  }

  async show(client, table) {
    const bookQuery =
      table === 'all books'
        ? `${selectAllBooks()};`
        : `select * from ${table};`;
    const errMsg = { msg: 'Table is empty.' };
    return await client.getAll(bookQuery, errMsg);
  }

  async search(client, info) {
    const booksQuery =
      info.key == 'available'
        ? selectAvailableBooks()
        : selectBooks(info.key, info[info.key]);
    const errMsg = { msg: `${info.key} ${info[info.key]} not matched.` };
    return await client.getAll(booksQuery, errMsg);
  }

  async registerUser(client, { id, name, password, designation }) {
    const registrationQuery = getInsertQuery('members', [
      id,
      name,
      password,
      designation,
    ]);
    return await client.runQuery(registrationQuery, {
      msg: 'Registered successfully.',
    });
  }

  async validatePassword(client, id, password) {
    const [user] = await client.getAll(getMemberQuery(id, password), {
      msg: 'Error in login.',
    });
    return { id: user.id, domain: user.designation };
  }
}

module.exports = { Library };
