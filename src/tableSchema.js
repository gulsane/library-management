// drop table if exists library_log;
// drop table if exists books;
// drop table if exists book_copies;
module.exports = {
  schema1: `
  create table if not exists books (
    ISBN varchar(20) Not null UNIQUE,
    title varchar(50) Not null,
    category varchar(20) DEFAULT 'unknown',
    author VARCHAR(20) DEFAULT 'unknown'
  );`,

  schema2: `
  create table if not exists book_copies (
    ISBN varchar(20) Not null,
    serial_no NUMERIC(5) not NULL,
    is_available NUMERIC(1)
  );`,

  schema3: `
  create table if not exists library_log (
    serial_no NUMERIC(5) not null,
    action VARCHAR(10) not null,
    user_name VARCHAR(20)
  );`,
};
