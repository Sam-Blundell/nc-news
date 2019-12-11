const connection = require('../db/connection');

const fetchTopics = () => {
  console.log("accessed fetchTopics model...")
  return connection.select('*').from('topics');
}

module.exports = fetchTopics;