// drop table if exists register;
// drop table if exists books;
// drop table if exists book_copies;
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
    ISBN varchar(20) Not null,
    serial_no NUMERIC(5) not NULL,
    is_available NUMERIC(1)
  );`,

  register: `
  create table if not exists register (
    serial_no NUMERIC(5) not null,
    action VARCHAR(10) not null,
    user_name VARCHAR(20)
  );`,

  books_select: `
  SELECT  books.ISBN
       ,books.title
       ,books.category
       ,books.author
       ,count(*) as books_count
       ,count(*) FILTER(WHERE book_copies.is_available = 'true') as available 
       from books
       join book_copies
on books.ISBN = book_copies.ISBN
group by books.ISBN`,
};
