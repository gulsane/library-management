const {DataBase} = require("./database");

class Processor {
  constructor() {
    this.functions = {};
  }

  parse(attributes) {
    return attributes.reduce((keyValue, attr) => {
      const [key, value] = attr.split('=');
      keyValue[key] = value;
      return keyValue;
    }, {});
  }

  process(input) {
    const [command, ...attributes] = input.trim().split(' ');
    return [command, this.parse(attributes)];
  }
}
