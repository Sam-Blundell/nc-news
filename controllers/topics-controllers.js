const fetchTopics = require('../models/topics-models');

const getTopics = (req, res, next) => {
  console.log('accessed getTopics controller...')
  fetchTopics()
    .then(topics => {
      res.status(200).send({ "topics": topics });
    })
    .catch(err => {
      next(err);
    })
}

module.exports = getTopics;