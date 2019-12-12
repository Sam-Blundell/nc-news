const { fetchArticle, updateArticle, insertComment } = require('../models/articles-models');

const getArticle = (req, res, next) => {
  console.log('accessed getArticle controller...');
  fetchArticle(req.params)
    .then(article => {
      res.status(200).send({ "article": article[0] })
    })
    .catch(err => {
      next(err);
    })
}

const patchArticle = (req, res, next) => {
  console.log('accessed patchArticle controller...')
  updateArticle(req.params, req.body)
    .then(article => {
      res.status(200).send({ "article": article[0] });
    })
    .catch(err => {
      next(err);
    })
}

const postComment = (req, res, next) => {
  console.log('accessed postComment controller...');
  insertComment(req.params, req.body)
    .then(comment => {
      res.status(201).send({ 'comment': comment[0] });
    })
    .catch(err => {
      next(err);
    })
}

module.exports = { getArticle, patchArticle, postComment };