const express = require('express');
const useMiddleware = require('./middleware/index.js');

const app = express();

useMiddleware(app);

module.exports = app;
