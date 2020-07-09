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

  register: `
  create table if not exists register (
    transactionId integer primary key autoincrement,
    id varchar(10) not null,
    action varchar(6) not null,
    serialNo integer not null,
    borrowDate date not null,
    dueDate date not null,
    returnDate date
  );`,

  members: `
  create table if not exists members(
    id varchar(10) unique not null,
    name varchar(10) not null,
    password varchar(10) not null,
    designation varchar(10) default 'borrower'
  );`,
};
