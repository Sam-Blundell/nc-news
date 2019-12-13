const { updateComment, removeComment } = require('../models/comments-models');

const patchComment = (req, res, next) => {
  console.log('accessed patchComment controller...');
  const { comment_id } = req.params;
  updateComment(comment_id, req.body)
    .then(comment => {
      res.status(200).send({ 'comment': comment });
    })
    .catch(err => {
      next(err);
    })
}

const deleteComment = (req, res, next) => {
  console.log('accessed deleteComment controller...');
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.sendStatus(204)
    })
    .catch(err => {
      next(err);
    })
}

module.exports = { patchComment, deleteComment }