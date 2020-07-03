const {Library} = require('./src/library');
const {startManagement} = require('./src/management');

const main = function () {
  const library = Library.init('./database/library.db');
  startManagement(library);
};

main();