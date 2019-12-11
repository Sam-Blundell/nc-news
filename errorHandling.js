const send405Error = (req, res, next) => {
  res.status(405).send({ "msg": "Method Not Allowed" });
};

module.exports = send405Error