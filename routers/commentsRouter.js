const commentsRouter = require('express').Router();
const { patchComment, deleteComment } = require('../controllers/comments-controllers')
const send405Error = require('../errorHandling');

commentsRouter.route('/:comment_id')
  .patch(patchComment)
  .delete(deleteComment)
  .all(send405Error)

module.exports = commentsRouter;