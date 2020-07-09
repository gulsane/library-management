const generate = require('./actions');
class Library {
  async addBook(client, book) {
    const { isbn, title, category, author } = book;
    const insertBook = generate.insertQuery('books', [ isbn, title, category, author, ]);
    const insertCopy = generate.insertQueryForCopy([isbn, true]);
    const transaction = generate.createTransaction([insertBook, insertCopy]);
    return client.executeTransaction(transaction, {
      msg: 'Book registered successfully.',
      isbn,
      title,
      category,
      author,
    });
  }

  async isIsbnAvailable(client, isbn) {
    const bookQuery = generate.searchQuery(`isbn`, isbn);
    return await client.getAll(bookQuery, { msg: `${isbn} not available.` });
  }

  async addCopy(client, isbn) {
    if (await this.isIsbnAvailable(client, isbn)) {
      const insertCopy = generate.insertQueryForCopy([isbn, true]);
      const transaction = generate.createTransaction([insertCopy]);
      return client.executeTransaction(transaction, {
        msg: 'Copy registered successfully.',
        isbn,
      });
    }
  }

  async borrowBook(client, bookInfo, userId) {
    const { key, isbn, title } = bookInfo;
    const availableBooks = generate.searchQuery(key, isbn, title);
    const [book] = await client.getAll(availableBooks, { msg: 'Book unavailable.', });
    const availableCopies = generate.availableCopiesQuery(book.isbn);
    const [bookCopy] = await client.getAll(availableCopies, { msg: 'Currently unavailable.', });
    const updateCopyAvailability = generate.updateBookQuery(bookCopy.serialNo, false);
    const currentDate = new Date();
    const updateRegister = generate.registerQuery('register', [
      userId,
      'borrow',
      bookCopy.serialNo,
      currentDate.toDateString(),
      new Date(currentDate.valueOf() + 864000000).toDateString(),
      null,
    ]);
    const transaction = generate.createTransaction([updateCopyAvailability, updateRegister]);
    return client.executeTransaction(transaction, { msg: 'borrowed successfully.', title: book.title, userId, serialNo: bookCopy.serialNo, });
  }

  async returnBook(client, serialNo, userId) {
    const borrowBooks = generate.borrowedCopyQuery(serialNo);
    const [book] = await client.getAll(borrowBooks, { msg: 'Book was not taken from library.', });
    const updateCopyAvailability = generate.updateBookQuery(book.serialNo, true);
    const [transactionDetails] = await client.getAll( generate.transactionQuery(serialNo) );
    const updateRegister = generate.registerQuery('register', [
      userId,
      'return',
      book.serialNo,
      transactionDetails.borrowDate,
      transactionDetails.dueDate,
      new Date().toDateString(),
    ]);
    const transaction = generate.createTransaction([updateCopyAvailability, updateRegister]);
    return client.executeTransaction(transaction, { msg: 'returned successfully.', userId, serialNo: book.serialNo, });
  }

  async show(client, table) {
    const bookQuery =
      table === 'all books'
        ? `${generate.booksQuery()};`
        : `select * from ${table};`;
    const errMsg = { msg: 'Table is empty.' };
    return await client.getAll(bookQuery, errMsg);
  }

  async search(client, info) {
    const booksQuery =
      info.key == 'available'
        ? generate.availableBooksQuery()
        : generate.searchQuery(info.key, info[info.key]);
    const errMsg = { msg: `${info.key} ${info[info.key]} not matched.` };
    return await client.getAll(booksQuery, errMsg);
  }

  async registerUser(client, { id, name, password, designation }) {
    const addMember = generate.insertQuery('members', [ id, name, password, designation, ]);
    return await client.runQuery(addMember, {
      msg: 'Registered successfully.',
    });
  }

  async validatePassword(client, id, password) {
    const [member] = await client.getAll(generate.memberQuery(id, password), {
      msg: 'Error in login.',
    });
    return { id: member.id, domain: member.designation };
  }
}

module.exports = { Library };
