const addBook = [
  {
    name: 'isbn',
    message: 'ISBN number : ',
    type: 'text',
    validate: (str) => Boolean(str),
  },
  {
    name: 'title',
    message: 'Title       : ',
    type: 'text',
    validate: (str) => Boolean(str),
  },
  {
    name: 'author',
    message: 'Author      : ',
    type: 'text',
    validate: (str) => Boolean(str),
  },
  {
    name: 'category',
    message: 'Category    : ',
    type: 'text',
    validate: (str) => Boolean(str)
  },
];

const addCopy = [
  {
    name: 'isbn',
    message: 'ISBN number : ',
    type: 'text',
    validate: (str) => Boolean(str)
  }
];

const returnBook = [
  {
    name: 'user',
    message: 'Enter name           : ',
    type: 'text',
    validate: (str) => Boolean(str),
  },
  {
    name: 'serial_no',
    message: 'Book\'s serial number : ',
    type: 'text',
    validate: (str) => Boolean(str),
  }
];

module.exports = {addBook, addCopy, returnBook};