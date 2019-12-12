const express = require('express');
const apiRouter = require('./routers/apiRouter');


const server = express();

server.use(express.json());

server.use('/api', apiRouter);

server.use((err, req, res, next) => {
  //console.log('///////// ERR /////////\n', err, '\n////////////////////////');
  //console.log(err.code);
  if (err.code === '22P02') {
    res.status(400).send({ msg: "Invalid Article Id" });
  } else {
    let [errCode, errMsg] = err.err;
    res.status(errCode).send({ msg: errMsg })
  }
});

module.exports = { server };