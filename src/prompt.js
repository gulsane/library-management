const addBook = [
  {
    name: 'isbn',
    message: 'Isbn number : ',
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
    validate: (str) => Boolean(str),
  },
];

const addCopy = [
  {
    name: 'isbn',
    message: 'Isbn number : ',
    type: 'text',
    validate: (str) => Boolean(str),
  },
];

const returnBook = [
  {
    name: 'serialNo',
    message: "Book's serial number : ",
    type: 'text',
    validate: (str) => Boolean(str),
  },
];

const showTable = [
  {
    name: 'table',
    message: 'Select a table name to see : ',
    type: 'list',
    choices: ['all books', 'copies', 'borrowActivity', 'returnActivity'],
  },
];

const borrowBook = [
  {
    name: 'key',
    message: 'Select a detail you can give',
    type: 'list',
    choices: ['isbn', 'title'],
  },
  {
    name: 'isbn',
    message: 'Isbn number  : ',
    type: 'text',
    when: ({ key }) => key == 'isbn',
    validate: (str) => Boolean(str),
  },
  {
    name: 'title',
    message: 'Title        : ',
    type: 'text',
    when: ({ key }) => key == 'title',
    validate: (str) => Boolean(str),
  },
];

const search = [
  {
    name: 'key',
    message: 'Choose any option to search',
    type: 'list',
    choices: ['isbn', 'title', 'author', 'category', 'available'],
  },
  {
    name: 'isbn',
    message: 'Isbn number  : ',
    type: 'text',
    when: ({ key }) => key == 'isbn',
    validate: (str) => Boolean(str),
  },
  {
    name: 'title',
    message: 'Title        : ',
    type: 'text',
    when: ({ key }) => key == 'title',
    validate: (str) => Boolean(str),
  },
  {
    name: 'author',
    message: 'Author name  : ',
    type: 'text',
    when: ({ key }) => key == 'author',
    validate: (str) => Boolean(str),
  },
  {
    name: 'category',
    message: 'Category     : ',
    type: 'text',
    when: ({ key }) => key == 'category',
    validate: (str) => Boolean(str),
  },
];

const signIn = [
  {
    name: 'id',
    message: 'Enter your user name    : ',
    type: 'text',
    validate: (str) => Boolean(str),
  },
  {
    name: 'name',
    message: 'Enter your name         : ',
    type: 'text',
    validate: (str) => Boolean(str),
  },
  {
    name: 'password',
    message: 'Enter password          : ',
    type: 'password',
    validate: (str) => Boolean(str),
  },
  {
    name: 'designation',
    message: 'Select your designation :',
    type: 'list',
    choices: ['librarian', 'borrower'],
  },
];

const login = [
  {
    name: 'id',
    message: 'Enter your user name : ',
    type: 'text',
    validate: (str) => Boolean(str),
  },
  {
    name: 'password',
    message: 'Enter password       : ',
    type: 'password',
    validate: (str) => Boolean(str),
  },
];

module.exports = {
  addBook,
  addCopy,
  borrowBook,
  returnBook,
  showTable,
  search,
  signIn,
  login,
};
