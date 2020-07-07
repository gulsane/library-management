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
    serial_no INTEGER not null,
    action VARCHAR(10) not null,
    user_name VARCHAR(20)
  );`,
};
