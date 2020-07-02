create table books (
  ISBN varchar(20) Not null,
  title varchar(50) Not null,
  category varchar(20) DEFAULT 'unknown',
  author VARCHAR(20) DEFAULT 'unknown'
);

create table book_copies (
  ISBN varchar(20) Not null,
  serial_no NUMERIC(5) not NULL,
  is_available NUMERIC(1)
);

create table library_log (
  serial_no NUMERIC(5) not null,
  action VARCHAR(10) not null,
  action_date date not null,
  user_name VARCHAR(20)
);
