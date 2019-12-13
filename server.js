const express = require('express');
const apiRouter = require('./routers/apiRouter');


const server = express();

server.use(express.json());

server.use('/api', apiRouter);

server.use((err, req, res, next) => {
  // console.log('///////// ERR /////////\n', err, '\n////////////////////////');

  const errorRef = {
    '22P02': [400, 'Bad Request'],
    '23503': [404, 'Not Found'], // needs to be more specific
    '42703': [400, 'Bad Request']
  }

  if (err.code) {
    res.status(errorRef[err.code][0]).send({ msg: errorRef[err.code][1] });
  } else {
    let [errCode, errMsg] = err.err;
    res.status(errCode).send({ msg: errMsg })
  }

});

module.exports = { server };