const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const handlebars = require('handlebars');
const mongoose = require('mongoose');
const fileupload = require('express-fileupload');
const { cookiesCleaner } = require('./auth.js');
const index = require('../routes/index');
const travels = require('../routes/travels');
const profile = require('../routes/profile');
const upload = require('../routes/upload');
const users = require('../routes/users');
const mytravels = require('../routes/mytravels');
const messages = require('../routes/messages');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const dbConnection = require('../db/config');

module.exports = function (app) {
  const PORT = process.env.PORT || 8000;
  app.use(fileupload());
  const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(handlebars),
  });

  app.engine('hbs', hbs.engine);

  app.set('views', path.join('views'));

  app.set('view engine', 'hbs');

  app.use(express.urlencoded({ extended: true, limit: '150mb' }));
  app.use(express.json({ limit: '150mb' }));
  app.use(express.static(path.join('public')));

  app.use(cookieParser());

  app.use(session({
    key: 'user_sid',
    secret: 'string',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: process.env.URL,
    }),
  }));

  app.use(cookiesCleaner);

  app.use((req, res, next) => {
    if (req.session.user) {
      res.locals.name = req.session.user;
    }
    next();
  });

  app.use('/', index);
  app.use('/users', users);
  app.use('/travels', travels);
  app.use('/profile', profile);
  app.use('/upload', upload);
  app.use('/mytravels', mytravels);
  app.use('/messages', messages);

  app.listen(PORT, async () => {
    await dbConnection();
    try {
      console.log(`Server started at http://localhost:/${PORT}`);
    } catch (e) {
      console.log(e);
    }
  });
};
