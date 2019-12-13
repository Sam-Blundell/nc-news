const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter');
const usersRouter = require('./usersRouter');
const articlesRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter');
const getApiMap = require('../controllers/api-controller');
const { send405Error } = require('../errorHandling');

apiRouter.route('/')
  .get(getApiMap)
  .all(send405Error);

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;