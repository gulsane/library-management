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


DROP table if exists book_copies;
create table book_copies (
  ISBN varchar(20) Not null,
  serial_no NUMERIC(5) not NULL,
  is_available NUMERIC(1)
);

--SAMPLE data

insert into book_copies values 
('AB1234', 00001, 'true'),
('AB1235', 00002, 'false'),
('AB1235', 00003, 'true'),
('AB1236', 00004, 'false'),
('AB1236', 00005, 'false');

-- UPDATE book_copies
-- set is_available = 'false'
-- where serial_no=00005;
-- ('AB1234', 00001, true),
-- ('AB1235', 00002, true),
-- ('AB1235', 00003, true),
-- ('AB1236', 00004, true),
-- ('AB1236', 00005, false);
-- SELECT * from books;

SELECT * from book_copies;

SELECT DISTINCT books.ISBN
      ,books.title
      ,books.category
      ,books.author
      ,count(*) over(PARTITION by books.ISBN) as books_count
      ,count(*) filter( WHERE book_copies.is_available = 'true') over(PARTITION by books.ISBN) as avialable
from books
join book_copies
on books.ISBN = book_copies.ISBN
;

SELECT  books.ISBN
       ,books.title
       ,books.category
       ,books.author
       ,count(*) as books_count
       ,count(*) FILTER(WHERE book_copies.is_available = 'true') as available 
       from books
       join book_copies
on books.ISBN = book_copies.ISBN
group by books.ISBN;

-- SELECT books.ISBN
--       ,books.title
--       ,books.category
--       ,books.author
--       ,count(*)  as is_available
-- from books
-- join book_copies
-- on books.ISBN = book_copies.ISBN 
-- and book_copies.is_available == true
-- group by books.ISBN;

SELECT * 
from (SELECT books.ISBN
      ,books.title
      ,books.category
      ,books.author
      ,count(*) as books_count
  from books
  join book_copies
  on books.ISBN = book_copies.ISBN
  group by books.ISBN)
where ISBN ='AB1234' or title ='new_book_1';
select count(is_available) from book_copies
where is_available = false;

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
