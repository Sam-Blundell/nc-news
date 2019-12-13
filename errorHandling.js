const send405Error = (req, res, next) => {
  res.status(405).send({ "msg": "Method Not Allowed" });
};

const noRouteError = (req, res, next) => {
  res.status(404).send({ msg: 'No Such Url' })
}

const errorHandler = (err, req, res, next) => {

  const errorRef = {
    '22P02': [400, 'Bad Request'],
    '23503': [404, 'Not Found'],
    '42703': [400, 'Bad Request']
  }

  if (err.code) {
    res.status(errorRef[err.code][0]).send({ msg: errorRef[err.code][1] });
  } else {
    let [errCode, errMsg] = err.err;
    res.status(errCode).send({ msg: errMsg })
  }
};

module.exports = { send405Error, noRouteError, errorHandler }