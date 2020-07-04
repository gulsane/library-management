const Sqlite = require("sqlite3");
const { books_select } = require("./schema");

class Database {
  constructor(path) {
    this.path = path;
    this.database = new Sqlite.Database(path);
  }

  creatTable(schema) {
    return new Promise((resolve, reject) => {
      this.database.run(schema, (err) => {
        if (err) reject(err);
        resolve("OK");
      });
    });
  }

  insertInTable(table, values) {
    const schema = `insert into ${table} values (`;
    const valueAsString = values.map((e) => `'${e}'`).join(",");
    return new Promise((resolve, reject) => {
      this.database.run(schema.concat(valueAsString, ");"), (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  updateBookAvailability(serial_no, curr_condition) {
    const schema = `update book_copies set is_available = '${curr_condition}' where serial_no='${serial_no}';`;
    this.database.run(schema);
  }

  getSerialNumber() {
    return new Promise((resolve, reject) => {
      this.database.get(
        "SELECT MAX(serial_no) as serial_number from book_copies;",
        (err, row) => {
          if (err) reject(err);
          resolve(row.serial_number);
        }
      );
    });
  }

  isIsbnAvailable(ISBN) {
    return new Promise((resolve, reject) => {
      this.database.all(
        `select * from books where ISBN='${ISBN}'`,
        (err, rows) => {
          if (rows.length === 0) reject(false);
          resolve(true);
        }
      );
    });
  }

  select(schema) {
    return new Promise((resolve, reject) => {
      this.database.get(schema, (err, row) => {
        if (err) reject(err);
        if (!row) reject("Book not found");
        resolve(row);
      });
    });
  }

  borrow(user_name, options) {
    let searchOptions = [];
    for (let option in options) {
      searchOptions.push(`${option}=='${options[option]}'`);
    }
    const schema = `select * from (${books_select}) where ${searchOptions.join(
      " and "
    )};`;

    return new Promise((resolve, reject) => {
      this.select(schema).then((row) => {
        const schema = `select * from book_copies where ISBN='${row.ISBN}' and is_available='true';`;

        this.select(schema)
          .then((book_copy) => {
            this.updateBookAvailability(book_copy.serial_no, "false");
            return `${book_copy.serial_no}`;
          })
          .then((serial_no) => {
            this.insertInTable("register", [serial_no, "borrow", user_name]);
            return serial_no;
          })
          .then((serial_no) =>
            resolve(
              `borrow successful\n  title : ${row.title}\n  user  : ${user_name}\n  serial_no : ${serial_no}`
            )
          )
          .catch((err) =>
            reject(
              err ||
                "Book not available\n\nPlease take a look on available books by using command :-\n * show"
            )
          );
      });
    });
  }

  return(user_name, serial_no) {
    const schema = `select * from book_copies where serial_no='${serial_no}' and is_available='false';`;
    return new Promise((resolve, reject) => {
      this.select(schema)
        .then((row) => {
          this.updateBookAvailability(row.serial_no, "true");
          this.insertInTable("register", [serial_no, "return", user_name]);
          resolve("return successful");
        })
        .catch(() => reject("Book was not taken"));
    });
  }

  selectAll(tableName, callback) {
    const schema = !tableName
      ? `${books_select};`
      : `select * from ${tableName};`;
    return this.database.all(schema, callback);
  }
}

module.exports = { Database };
