const express = require('express');
const apiRouter = require('./routers/apiRouter');
const { noRouteError, errorHandler } = require('./errorHandling');
const cors = require('cors');

const server = express();

server.use(cors());

server.use(express.json());

server.use('/api', apiRouter);

server.use('/*', noRouteError)

server.use(errorHandler)

module.exports = { server };