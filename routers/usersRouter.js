const usersRouter = require('express').Router();
const getUsers = require('../controllers/users-controllers');
const { send405Error } = require('../errorHandling');

usersRouter.route('/:username')
  .get(getUsers)
  .all(send405Error)


module.exports = usersRouter