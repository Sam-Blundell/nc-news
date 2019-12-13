const apiMapFile = require('../endpoints.json')

const getApiMap = (req, res, next) => {
  res.status(200).send(apiMapFile);
};

module.exports = getApiMap