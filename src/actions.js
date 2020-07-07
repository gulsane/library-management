const getInsertQuery = function (table, values) {
  const insertQuery = `insert into ${table} values (`;
  return insertQuery.concat(values.map((e) => `'${e}'`).join(","), ");");
};

const getInsertQueryForBook = function (values) {
  const insertQuery = `insert into book_copies (ISBN, is_available)  values (`;
  return insertQuery.concat(values.map((e) => `'${e}'`).join(","), ");");
};

const createTransaction = function (operations) {
  const operationsList = operations.join(";");
  const transaction = `BEGIN TRANSACTION; ${operationsList}; COMMIT;`;
  return transaction;
};

const selectBooks = function (key, value1, value2) {
  return `select * from (${selectAllBooks()}) where ${key}=='${
    value1 || value2
  }';`;
};

const selectAvailableCopies = function (isbn) {
  return `select * from book_copies where ISBN='${isbn}' and is_available='true';`;
};

const updateBookState = function (serial_number, state) {
  return `update book_copies set is_available = '${state}' where serial_no='${serial_number}'`;
};

const selectBorrowedCopy = function (serial_number) {
  return `select * from book_copies where serial_no='${serial_number}' and is_available='false';`;
};

const selectAllBooks = function () {
  return `
  SELECT books.ISBN
       ,books.title
       ,books.category
       ,books.author
       ,count(*) as books_count
       ,count(*) FILTER(WHERE book_copies.is_available = 'true') as available 
       from books
       join book_copies
on books.ISBN = book_copies.ISBN
group by books.ISBN`;
};

module.exports = {
  getInsertQuery,
  createTransaction,
  selectBooks,
  selectAvailableCopies,
  updateBookState,
  selectBorrowedCopy,
  selectAllBooks,
  getInsertQueryForBook,
};
