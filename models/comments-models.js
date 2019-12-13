const connection = require('../db/connection');
const checkIfRowExists = require('../errorHandling')

const updateComment = (id, votes) => {
  console.log('accessed updateComment model...')
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
  console.log('accessed removeComment model...');

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