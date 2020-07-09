module.exports = {
  books: `
  create table if not exists books (
    ISBN varchar(20) Not null UNIQUE,
    title varchar(50) Not null,
    category varchar(20) DEFAULT 'unknown',
    author VARCHAR(20) DEFAULT 'unknown'
  );`,

  copies: `
  create table if not exists book_copies (
    serial_no INTEGER Primary key AUTOINCREMENT,
    ISBN varchar(20) Not null,
    is_available NUMERIC(1)
  );`,

  register: `
  create table if not exists register (
    transactionId integer primary key autoincrement,
    id varchar(10) not null,
    action varchar(6) not null,
    serial_no INTEGER not null,
    borrowDate date not null,
    dueDate date not null,
    returnDate date
  );`,

  members: `
  create table if not exists members(
    id VARCHAR(10) unique not null,
    name VARCHAR(10) not null,
    password VARCHAR(10) not null,
    designation VARCHAR(10) default 'borrower'
  );
  `
};
