const {stdin, stdout} = require('process');
const {Processor} = require('./src/commandProcessor');
const {Library} = require('./src/library');

stdin.setEncoding('utf-8');
stdin.setRawMode(false);

const main = function () {

  const library = Library.init('./database/library.db');
  
  stdout.write('library $ ');
  stdin.on('data', (data) => {
    // stdout.write(data);
    const [command, arguments] = Processor.process(data);
    library.run(command, arguments);
    stdout.write('library $ ');
  });
};

main();
