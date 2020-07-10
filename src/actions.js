const insertQuery = function (table, values) {
  const insertQuery = `insert into ${table} values (`;
  return insertQuery.concat(values.map((e) => `'${e}'`).join(','), ');');
};

const borrowActivityQuery = function (values) {
  const insertQuery = `insert into borrowActivity (memberId,serialNo,borrowDate,dueDate) values (`;
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

const transactionQuery = function (serialNumber,userId) {
  return `select * from (${userActivityLogQuery(userId)}) where bookSerialNumber = '${serialNumber}' and returnDate is null;`;
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

const activityLogQuery = function () {
  return `
  select ba.transactionId
        ,ba.memberId
        ,ba.serialNo as bookSerialNumber
        ,ba.borrowDate
        ,ba.dueDate
        ,ra.returnDate
  from borrowActivity as ba
  left join returnActivity as ra
  on ba.transactionId = ra.transactionId`;
};

const userActivityLogQuery = function (userId) {
  return `${activityLogQuery()} where memberId='${userId}'`
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
  borrowActivityQuery,
  transactionQuery,
  activityLogQuery,
  userActivityLogQuery,
};
