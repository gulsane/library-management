const { stdin, stdout } = require('process');
stdin.setEncoding('utf-8');
stdin.setRawMode(false);

const main = function () {

  stdout.write('library $ ');
  stdin.on('data', (data) => {
    stdout.write(data);
    stdout.write('library $ ');
  });
};

main();
