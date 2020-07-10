module.exports = {
  books: `
  create table if not exists books (
    isbn varchar(20) Not null UNIQUE,
    title varchar(50) Not null,
    category varchar(20) DEFAULT 'unknown',
    author varchar(20) DEFAULT 'unknown'
  );`,

  copies: `
  create table if not exists copies (
    serialNo integer Primary key autoincrement,
    isbn varchar(20) Not null,
    isAvailable numeric(1)
  );`,

  borrowActivity: `
  create table if not exists borrowActivity (
    transactionId integer primary key autoincrement,
    memberId varchar(10) not null,
    serialNo integer not null,
    borrowDate date not null,
    dueDate date not null
  );`,

  returnActivity: `
  create table if not exists returnActivity (
    transactionId integer primary key,
    returnDate date not null
  );`,

  members: `
  create table if not exists members(
    id varchar(10) unique not null,
    name varchar(10) not null,
    password varchar(10) not null,
    designation varchar(10) default 'borrower'
  );`,
};
