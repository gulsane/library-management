const getInsertQuery = function (table, values) {
  const insertQuery = `insert into ${table} values (`;
  return insertQuery.concat(values.map((e) => `'${e}'`).join(","), ");");
};

const createTransaction = function (operations) {
  const operationsList = operations.join(";");
  const transaction = `BEGIN TRANSACTION; ${operationsList}; COMMIT;`;
  return transaction;
};

module.exports = { getInsertQuery, createTransaction };
