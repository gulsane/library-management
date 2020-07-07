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
    name: 'serial_no',
    message: 'Book\'s serial number : ',
    type: 'text',
    validate: (str) => Boolean(str),
  },
  {
    name: 'user',
    message: 'Enter name            : ',
    type: 'text',
    validate: (str) => Boolean(str),
  }
];

const showTable = [
  {
    name: 'table',
    message: 'select a table to see : ',
    type: 'list',
    choices: ['all books', 'book_copies', 'register']
  }
]

const borrowBook = [
  {
    name: 'user',
    message: 'Enter name  : ',
    type: 'text',
    validate: (str) => Boolean(str),
  },
  {
    name: 'info',
    message: 'select a detail you can give',
    type: 'list',
    choices: ['ISBN', 'title'],
  },
  {
    name: 'ISBN',
    message: 'ISBN number : ',
    type: 'text',
    when: ({info}) => info == 'ISBN',
    validate: (str) => Boolean(str),
  },
  {
    name: 'title',
    message: 'title : ',
    type: 'text',
    when: ({info}) => info == 'title',
    validate: (str) => Boolean(str),
  },
];

const search = [
  {
    name: 'key',
    message: 'choose one you want to search by',
    type: 'list',
    choices: ['ISBN', 'title', 'author', 'category']
  },
  {
    name: 'ISBN',
    message: 'ISBN number : ',
    type: 'text',
    when: ({key}) => key == 'ISBN',
    validate: (str) => Boolean(str),
  },
  {
    name: 'title',
    message: 'title : ',
    type: 'text',
    when: ({key}) => key == 'title',
    validate: (str) => Boolean(str),
  },
  {
    name: 'author',
    message: 'author name: ',
    type: 'text',
    when: ({key}) => key == 'author',
    validate: (str) => Boolean(str),
  },
  {
    name: 'category',
    message: 'category : ',
    type: 'text',
    when: ({key}) => key == 'category',
    validate: (str) => Boolean(str),
  }
]

module.exports = {addBook, addCopy, borrowBook, returnBook, showTable, search};