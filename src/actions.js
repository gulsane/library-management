const { books_select } = require("./schema");

const getInsertQuery = function (table, values) {
  const insertQuery = `insert into ${table} values (`;
  return insertQuery.concat(values.map((e) => `'${e}'`).join(","), ");");
};

const createTransaction = function (operations) {
  const operationsList = operations.join(";");
  const transaction = `BEGIN TRANSACTION; ${operationsList}; COMMIT;`;
  return transaction;
};

const selectBooks = function (info, isbn, title) {
  return `select * from (${books_select}) where ${info}=='${isbn || title}';`;
};

const selectAvailableCopies = function (isbn) {
  return `select * from book_copies where ISBN='${isbn}' and is_available='true';`;
};

const getUpdateTable = function (serial_number) {
  return `update book_copies set is_available = 'false' where serial_no='${serial_number}'`;
};

module.exports = { getInsertQuery, createTransaction, selectBooks, selectAvailableCopies, getUpdateTable, };