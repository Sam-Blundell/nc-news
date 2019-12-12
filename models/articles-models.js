const connection = require('../db/connection');

const fetchArticle = (params) => {
  console.log('accessed fetchArticle model...');
  return connection.select('articles.*')
    .from('articles')
    .count({ comment_count: 'comments.article_id' })
    .where('articles.article_id', '=', params.article_id)
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .then(selection => {
      if (selection.length === 0) {
        return Promise.reject({ 'err': [404, 'Article Not Found'] });
      } else {
        return selection;
      }
    })
}

const updateArticle = (params, voteChange) => {
  console.log('accessed updateArticle model...');
  if (!Number.isInteger(voteChange.inc_votes) || Object.keys(voteChange).length > 1) {
    return Promise.reject({ err: [400, 'Invalid Request Body'] })
  } else {
    return connection('articles')
      .where('articles.article_id', '=', params.article_id)
      .increment('votes', voteChange.inc_votes)
      .returning('*')
      .then(article => {
        if (article.length === 0) {
          return Promise.reject({ 'err': [404, 'Article Not Found'] })
        } else {
          return article;
        }
      })
  }
}

const insertComment = (article_id, comment) => {
  console.log('accessed insertComment model...')
  let keyArr = Object.keys(comment);
  if (keyArr.length !== 2 || !keyArr.includes('username') || !keyArr.includes('body')) {
    return Promise.reject({ err: [400, 'Invalid Request Body'] })
  } else {
    return connection('comments')
      .insert({
        author: comment.username,
        article_id: article_id.article_id,
        body: comment.body
      })
      .returning('*');
  }

}

module.exports = { fetchArticle, updateArticle, insertComment };