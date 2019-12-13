const connection = require('../db/connection');
const checkIfRowExists = require('../errorHandling')

const updateComment = (id, votes) => {
  if (!votes.inc_votes) votes.inc_votes = 0;
  if (!Number.isInteger(votes.inc_votes) || Object.keys(votes).length !== 1) {
    return Promise.reject({ 'err': [400, 'Invalid Request Body'] })
  } else {
    return connection('comments')
      .where('comment_id', '=', id)
      .increment('votes', votes.inc_votes)
      .returning('*')
      .then(comment => {
        if (!comment.length) {
          return Promise.reject({ 'err': [404, 'Comment Not Found'] })
        } else {
          return comment;
        }
      })
  }
}

const removeComment = (id) => {
  return connection('comments')
    .where('comment_id', '=', id)
    .del()
    .then(comment => {
      if (!comment) {
        return Promise.reject({ 'err': [404, 'Comment Not Found'] })
      }
    })
}

module.exports = { updateComment, removeComment }