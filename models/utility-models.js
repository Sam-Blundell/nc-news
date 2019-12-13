const connection = require('../db/connection');

const checkIfRowExists = (table, column, value) => {
  return connection.select('*').from(table)
    .where(column, '=', value)
    .then(result => {
      if (!result.length) {
        return Promise.reject({ err: [404, `No Such ${column}`] })
      } else {
        return [];
      }
    })
}

module.exports = checkIfRowExists;