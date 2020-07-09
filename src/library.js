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
  getMemberQuery
} = require("./actions");

class Library {
  async addBook(client, book) {
    const {isbn, title, category, author} = book;
    const updateBooks = getInsertQuery("books", [isbn, title, category, author,]);
    const updateCopies = getInsertQueryForBook([isbn, true]);
    const transaction = createTransaction([updateBooks, updateCopies]);
    return client.executeTransaction(transaction, {
      msg: "Book successfully added",
      isbn,
      title,
      category,
      author,
    });
  }

  async isIsbnAvailable(client, isbn) {
    const bookQuery = selectBooks(`ISBN`, isbn);
    return await client.getAll(bookQuery, {msg: `${isbn} not available`});
  }

  async addCopy(client, isbn) {
    if (await this.isIsbnAvailable(client, isbn)) {
      const updateCopies = getInsertQueryForBook([isbn, true]);
      const transaction = createTransaction([updateCopies]);
      return client.executeTransaction(transaction, {
        msg: "Copy successfully added",
        isbn,
      });
    }
  }

  async borrowBook(client, bookInfo, userId) {
    const {key, ISBN, title} = bookInfo;
    const availableBooksQuery = selectBooks(key, ISBN, title);
    const [row] = await client.getAll(availableBooksQuery, {
      msg: "Book not available in library",
    });
    const availableCopyQuery = selectAvailableCopies(row.ISBN);
    const [bookCopy] = await client.getAll(availableCopyQuery, {
      msg: "Currently no copy available of this book",
    });
    const updateTable = updateBookState(bookCopy.serial_no, false);
    const addTable = getInsertQuery("register", [
      bookCopy.serial_no,
      "borrow",
      userId,
    ]);
    const transaction = createTransaction([updateTable, addTable]);
    return client.executeTransaction(transaction, {
      msg: "borrow successful",
      title: row.title,
      userId,
      serial_no: bookCopy.serial_no,
    });
  }

  async returnBook(client, serial_no, userId) {
    const borrowedBookQuery = selectBorrowedCopy(serial_no);
    const [borrowedBook] = await client.getAll(borrowedBookQuery, {
      msg: "Book was not taken from library",
    });
    const updateTable = updateBookState(borrowedBook.serial_no, true);
    const addTable = getInsertQuery("register", [
      borrowedBook.serial_no,
      "return",
      userId
    ]);
    const transaction = createTransaction([updateTable, addTable]);
    return client.executeTransaction(transaction, {
      msg: "return successful",
      userId,
      serial_no: borrowedBook.serial_no,
    });
  }

  async show(client, table) {
    const bookQuery =
      table === "all books"
        ? `${selectAllBooks()};`
        : `select * from ${table};`;
    const errMsg = {msg: "Table is empty"};
    return await client.getAll(bookQuery, errMsg);
  }

  async search(client, info) {
    const booksQuery = info.key == 'available' ? selectAvailableBooks() : selectBooks(info.key, info[info.key]);
    const errMsg = {msg: `${info.key} ${info[info.key]} not matched`};
    return await client.getAll(booksQuery, errMsg);
  }

  async registerUser(client, {id, name, password, designation}) {
    const registrationQuery = getInsertQuery('members', [id, name, password, designation]);
    return await client.runQuery(registrationQuery, {msg: 'Successfully register'});
  }

  async validatePassword(client, id, password) {
    const [user] = await client.getAll(getMemberQuery(id, password), {msg: "error in login"});
    // return user.designation;
    return {id: user.id, domain: user.designation};
  }
}

module.exports = {Library};
