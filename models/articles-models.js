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
  if (!Number.isInteger(voteChange.inc_votes)) {
    return Promise.reject({ err: [400, 'Invalid Request Body'] })
  } else {
    return connection('articles')
      .where('articles.article_id', '=', params.article_id)
      .increment('votes', voteChange.inc_votes)
    //.returning('*'); can't just do return here because the article doesn't have a "comment_count"
    // better to just return here and then call fetchArticle in the controller or re-write same code in this model?

  }
}

module.exports = { fetchArticle, updateArticle };