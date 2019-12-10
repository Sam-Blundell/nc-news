exports.formatDates = list => {
  if (list.length === 0) return [];

  const newList = [...list];

  newList.map(object => {
    object.created_at = new Date(object.created_at);
  })

  return newList;

};

exports.makeRefObj = list => {
};

exports.formatComments = (comments, articleRef) => { };
