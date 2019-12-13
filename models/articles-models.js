const connection = require('../db/connection');
const checkIfRowExists = require('./utility-models')

const fetchArticleById = (params) => {
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

const updateArticle = (id, voteChange) => {
  if (!voteChange.inc_votes) voteChange.inc_votes = 0;
  if (!Number.isInteger(voteChange.inc_votes) || Object.keys(voteChange).length > 1) {
    return Promise.reject({ err: [400, 'Invalid Request Body'] })
  } else {
    return connection('articles')
      .where('articles.article_id', '=', id)
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

const fetchComments = (article_id, sort_by = 'created_at', order = 'desc') => {
  if ((order !== 'asc') && (order !== 'desc')) { order = 'desc' };
  return connection.select('author', 'body', 'comment_id', 'created_at', 'votes')
    .from('comments')
    .where('article_id', '=', article_id)
    .orderBy(sort_by, order)
    .then(comments => {
      if (!comments.length) {
        return checkIfRowExists('articles', "article_id", article_id)
      } else {
        return comments;
      }
    })
}

const fetchArticles = (sort_by = 'created_at', order = 'desc', author, topic) => {
  if ((order !== 'asc') && (order !== 'desc')) { order = 'desc' };
  return connection.select('articles.author', 'title', 'articles.article_id', 'topic', 'articles.created_at', 'articles.votes')
    .from('articles')
    .count({ comment_count: 'comments.article_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .orderBy(sort_by, order)
    .modify(query => {
      if (author) query.where("articles.author", "=", author)
    })
    .modify(query => {
      if (topic) query.where("articles.topic", "=", topic)
    })
    .then(articles => {
      if (articles.length) {
        return articles;
      } else {
        if (author) {
          return checkIfRowExists('users', 'username', author)
        } else if (topic) {
          return checkIfRowExists('topics', 'slug', topic)
        }
      }
    })
}

module.exports = { fetchArticleById, updateArticle, insertComment, fetchComments, fetchArticles };