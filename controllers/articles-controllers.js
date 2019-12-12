const { fetchArticle, updateArticle } = require('../models/articles-models');

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
  console.log('accessed patchArticle controller...');
  //console.log(req.body)
  updateArticle(req.params, req.body)
    .then(() => {
      return fetchArticle(req.params)
    })
    .then(article => {
      res.status(200).send({ "article": article[0] });
    })
    .catch(err => {
      next(err);
    })
}

module.exports = { getArticle, patchArticle };