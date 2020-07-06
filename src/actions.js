const getInsertQuery = function (table, values) {
  const insertQuery = `insert into ${table} values (`;
  return insertQuery.concat(values.map((e) => `'${e}'`).join(","), ");");
};

const createTransaction = function (operations) {
  const operationsList = operations.join(";");
  const transaction = `BEGIN TRANSACTION; ${operationsList}; COMMIT;`;
  return transaction;
};

const getAvailableBooksQuery = function (info, isbn, title) {
  return `select * from (${books_select}) where ${info}=='${isbn || title}';`;
};

module.exports = { getInsertQuery, createTransaction, getAvailableBooksQuery };
