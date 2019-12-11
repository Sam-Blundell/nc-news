const express = require('express');
const apiRouter = require('./routers/apiRouter');


const server = express();

server.use(express.json());

server.use('/api', apiRouter);

server.use((err, req, res, next) => {
  res.status(404).send({ msg: err.msg })
});

module.exports = { server };