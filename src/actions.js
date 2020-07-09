const insertQuery = function (table, values) {
  const insertQuery = `insert into ${table} values (`;
  return insertQuery.concat(values.map((e) => `'${e}'`).join(','), ');');
};

const registerQuery = function (table, values) {
  const insertQuery = `insert into ${table} (id,action,serialNo,borrowDate,dueDate,returnDate) values (`;
  return insertQuery.concat(values.map((e) => `'${e}'`).join(','), ');');
};

const insertQueryForCopy = function (values) {
  const insertQuery = `insert into copies (isbn, isAvailable)  values (`;
  return insertQuery.concat(values.map((e) => `'${e}'`).join(','), ');');
};

const createTransaction = function (operations) {
  const operationsList = operations.join(';');
  const transaction = `begin transaction; ${operationsList}; commit;`;
  return transaction;
};

const searchQuery = function (key, value1, value2) {
  return `select * from (${booksQuery()}) where ${key}='${value1 || value2}';`;
};

const availableBooksQuery = function () {
  return `select * from (${booksQuery()}) where available>=1;`;
};

const availableCopiesQuery = function (isbn) {
  return `select * from copies where isbn='${isbn}' and isAvailable='true';`;
};

const updateBookQuery = function (serialNumber, state) {
  return `update copies set isAvailable = '${state}' where serialNo='${serialNumber}'`;
};

const borrowedCopyQuery = function (serialNumber) {
  return `select * from copies where serialNo='${serialNumber}' and isAvailable='false';`;
};

const transactionQuery = function (serialNumber) {
  return `select * from register where serialNo= '${serialNumber}' and action='borrow' order by transactionId desc;`;
};

const memberQuery = function (id, password) {
  return `select * from members where id = '${id}' and password = '${password}';`;
};

const booksQuery = function () {
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
  insertQuery,
  createTransaction,
  searchQuery,
  availableCopiesQuery,
  updateBookQuery,
  borrowedCopyQuery,
  booksQuery,
  insertQueryForCopy,
  availableBooksQuery,
  memberQuery,
  registerQuery,
  transactionQuery,
};
