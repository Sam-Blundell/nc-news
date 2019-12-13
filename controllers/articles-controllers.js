const { fetchArticleById, updateArticle, insertComment, fetchComments, fetchArticles } = require('../models/articles-models');

const getArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  fetchArticles(sort_by, order, author, topic)
    .then(articles => {
      res.status(200).send({ "articles": articles })
    })
    .catch(err => {
      next(err);
    })
}

const getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(article => {
      res.status(200).send({ "article": article[0] })
    })
    .catch(err => {
      next(err);
    })
}

const patchArticle = (req, res, next) => {
  const { article_id } = req.params
  updateArticle(article_id, req.body)
    .then(article => {
      res.status(200).send({ "article": article[0] });
    })
    .catch(err => {
      next(err);
    })
}

const postComment = (req, res, next) => {
  insertComment(req.params, req.body)
    .then(comment => {
      res.status(201).send({ 'comment': comment[0] });
    })
    .catch(err => {
      next(err);
    })
}

const getComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  fetchComments(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ 'comments': comments });
    })
    .catch(err => {
      next(err);
    })
}

module.exports = { getArticleById, patchArticle, postComment, getComments, getArticles };