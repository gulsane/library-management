const {DataBase} = require("./database");

class Processor {
  static parse(attributes) {
    return attributes.reduce((keyValue, attr) => {
      const [key, value] = attr.split('=');
      keyValue[key] = value;
      return keyValue;
    }, {});
  }

  static process(input) {
    const [command, ...attributes] = input.trim().split(' ');
    return [command, Processor.parse(attributes)];
  }
}

module.exports = {Processor};