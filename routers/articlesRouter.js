const articlesRouter = require('express').Router();
const { getArticle, patchArticle, postComment } = require('../controllers/articles-controllers');
const send405Error = require('../errorHandling')

articlesRouter.route('/:article_id')
  .get(getArticle)
  .patch(patchArticle)
  .all(send405Error);

articlesRouter.route('/:article_id/comments')
  .post(postComment)

module.exports = articlesRouter;