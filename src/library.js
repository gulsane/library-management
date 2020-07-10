const generate = require('./actions');
const {booksQuery} = require('./actions');
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

  async borrowBook(client, bookInfo, memberId) {
    const { key, isbn, title } = bookInfo;
    const availableBooks = generate.searchQuery(key, isbn, title);
    const book = await client.get(availableBooks, { msg: 'Book unavailable.', });
    const availableCopies = generate.availableCopiesQuery(book.isbn);
    const bookCopy = await client.get(availableCopies, { msg: 'Currently unavailable.', });
    const updateCopyAvailability = generate.updateBookQuery(bookCopy.serialNo, false);
    const currentDate = new Date();
    const updateBorrowActivity = generate.borrowActivityQuery([
      memberId,
      bookCopy.serialNo,
      currentDate.toDateString(),
      new Date(currentDate.valueOf() + 864000000).toDateString()
    ]);
    const transaction = generate.createTransaction([updateCopyAvailability, updateBorrowActivity]);
    return client.executeTransaction(transaction, { msg: 'borrowed successfully.', title: book.title, memberId, serialNo: bookCopy.serialNo, });
  }

  async returnBook(client, serialNo, userId) {
    const borrowBooks = generate.borrowedCopyQuery(serialNo);
    const book = await client.get(borrowBooks, { msg: 'Book was not taken from library.', });
    const updateCopyAvailability = generate.updateBookQuery(book.serialNo, true);
    const transactionDetails = await client.get( generate.transactionQuery(serialNo) );
    const updateReturnActivity = generate.insertQuery('returnActivity', [
      transactionDetails.transactionId,
      new Date().toDateString()
    ]);
    const transaction = generate.createTransaction([updateCopyAvailability, updateReturnActivity]);
    return client.executeTransaction(transaction, { msg: 'returned successfully.', userId, serialNo: book.serialNo, });
  }

  async show(client, table) {
    let bookQuery = `select * from ${table};`;
    if (table === 'activity log') bookQuery = generate.activityLogQuery();
    if (table === 'all books') bookQuery = `${generate.booksQuery()};`;
    const errMsg = { msg: 'Table is empty.' };
    return await client.getAll(bookQuery, errMsg);
  }

  async search(client, info) {
    let booksQuery = generate.availableBooksQuery();
    if(info.key !== 'available') booksQuery = generate.searchQuery(info.key, info[info.key]);
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
    const member = await client.get(generate.memberQuery(id, password), {
      msg: 'Details not matched.',
    });
    return { id: member.id, domain: member.designation };
  }
}

module.exports = { Library };
