exports.formatDates = list => {

  const newList = list.map(obj => {
    return { ...obj }
  });

  newList.map(object => {
    object.created_at = new Date(object.created_at);
  })

  return newList;
};

exports.makeRefObj = list => {
  refObj = {};

  list.forEach(article => {
    refObj[article.title] = article.article_id;
  })

  return refObj;
};

exports.formatComments = (comments, articleRef) => {

  const newComments = comments.map(obj => {
    return { ...obj }
  });

  newComments.map(comment => {
    comment.author = comment.created_by;
    comment.article_id = articleRef[comment.belongs_to];
    comment.created_at = new Date(comment.created_at);
    delete comment.created_by;
    delete comment.belongs_to;
  })

  return newComments;
};
