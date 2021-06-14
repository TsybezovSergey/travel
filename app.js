const express = require('express');
const useMiddleware = require('./middleware/index.js');
const firebase = require('firebase');
require('firebase/storage');

const app = express();

useMiddleware(app);

module.exports = app;
