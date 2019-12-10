exports.formatDates = list => {
  if (list.length === 0) return [];

  const newList = [...list];

  newList.map(object => {
    object.created_at = new Date(object.created_at);
  })

  return newList;

};

exports.makeRefObj = list => {
  if (list.length === 0) return {};

  refObj = {};

  list.forEach(article => {
    refObj[article.title] = article.article_id;
  })

  return refObj;
};

exports.formatComments = (comments, articleRef) => { };
