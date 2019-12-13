const articlesRouter = require('express').Router();
const { getArticleById, patchArticle, postComment, getComments, getArticles } = require('../controllers/articles-controllers');
const { send405Error } = require('../errorHandling')

articlesRouter.route('/')
  .get(getArticles)
  .all(send405Error)

articlesRouter.route('/:article_id')
  .get(getArticleById)
  .patch(patchArticle)
  .all(send405Error);

articlesRouter.route('/:article_id/comments')
  .post(postComment)
  .get(getComments)
  .all(send405Error)

module.exports = articlesRouter;