const connection = require('../db/connection');

const fetchUsers = (params) => {
  console.log("accessed fetchUsers model...")
  return connection.select('*').from('users').where('username', '=', params.username)
    .then(selection => {
      if (selection.length === 0) {
        return Promise.reject({ err: [404, "User Not Found"] })
      } else {
        return selection;
      }
    })
}

module.exports = fetchUsers