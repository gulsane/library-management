drop table if exists books;
create table books (
  ISBN varchar(20) Not null UNIQUE,
  title varchar(50) Not null,
  category varchar(20) DEFAULT 'unknown',
  author VARCHAR(20) DEFAULT 'unknown'
);

--sample data 

insert into books values 
('AB1234', 'new_book', 'category 1', 'author 1'),
('AB1235', 'new_book_1', 'category 2', 'author 2'),
('AB1236', 'new_book_2', 'category 1', 'author 3');

SELECT * from books;

DROP table if exists book_copies;
create table book_copies (
  ISBN varchar(20) Not null,
  serial_no NUMERIC(5) not NULL,
  is_available NUMERIC(1)
);

--SAMPLE data

insert into book_copies values 
('AB1234', 00001, 1),
('AB1235', 00002, 1),
('AB1235', 00003, 1),
('AB1236', 00004, 1),
('AB1236', 00005, 1);

SELECT * from book_copies;

SELECT books.ISBN
      ,books.title
      ,books.category
      ,books.author
      ,count(*) as books_count
from books
join book_copies
on books.ISBN = book_copies.ISBN
group by books.ISBN;

-- drop table if exists library_log;

create table library_log (
  serial_no NUMERIC(5) not null,
  action VARCHAR(10) not null,
  user_name VARCHAR(20)
);

SELECT MAX(serial_no) +1 from book_copies;
-- sample data

insert into library_log VALUES
(00001, 'return', 'ayush'),
(00002, 'return', 'gulshan'),
(00003, 'borrow', 'ayush'),
(00003, 'borrow', 'gulshan'),
(00002, 'borrow', 'gulshan'),
(00001, 'borrow', 'ayush');

select * from library_log;
