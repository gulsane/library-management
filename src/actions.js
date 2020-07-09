const getInsertQuery = function (table, values) {
  const insertQuery = `insert into ${table} values (`;
  return insertQuery.concat(values.map((e) => `'${e}'`).join(','), ');');
};

const getRegisterQuery = function (table, values) {
  const insertQuery = `insert into ${table} (id,action,serialNo,borrowDate,dueDate,returnDate) values (`;
  return insertQuery.concat(values.map((e) => `'${e}'`).join(','), ');');
};

const getInsertQueryForBook = function (values) {
  const insertQuery = `insert into copies (isbn, isAvailable)  values (`;
  return insertQuery.concat(values.map((e) => `'${e}'`).join(','), ');');
};

const createTransaction = function (operations) {
  const operationsList = operations.join(';');
  const transaction = `begin transaction; ${operationsList}; commit;`;
  return transaction;
};

const selectBooks = function (key, value1, value2) {
  return `select * from (${selectAllBooks()}) where ${key}='${
    value1 || value2
  }';`;
};

const selectAvailableBooks = function () {
  return `select * from (${selectAllBooks()}) where available>=1;`;
};

const selectAvailableCopies = function (isbn) {
  return `select * from copies where isbn='${isbn}' and isAvailable='true';`;
};

const updateBookState = function (serialNumber, state) {
  return `update copies set isAvailable = '${state}' where serialNo='${serialNumber}'`;
};

const selectBorrowedCopy = function (serialNumber) {
  return `select * from copies where serialNo='${serialNumber}' and isAvailable='false';`;
};

const getTransaction = function (serialNumber) {
  return `select * from register where serialNo= '${serialNumber}' and action='borrow' order by transactionId desc;`;
};

const getMemberQuery = function (id, password) {
  return `select * from members where id = '${id}' and password = '${password}';`;
};

const selectAllBooks = function () {
  return `
  select books.isbn
       ,books.title
       ,books.category
       ,books.author
       ,count(*) as booksCount
       ,count(*) filter(where copies.isAvailable = 'true') as available 
       from books
       join copies
on books.isbn = copies.isbn
group by books.isbn`;
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
  selectAvailableBooks,
  getMemberQuery,
  getRegisterQuery,
  getTransaction,
};
