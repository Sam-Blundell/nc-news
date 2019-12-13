const fetchUsers = require('../models/users-models.js')

const getUsers = (req, res, next) => {
  fetchUsers(req.params)
    .then(user => {
      res.status(200).send({ "user": user[0] });
    })
    .catch(err => {
      next(err);
    })
}

module.exports = getUsers;