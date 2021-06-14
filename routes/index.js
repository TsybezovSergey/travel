const { Router } = require('express');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');
const User = require('../model/user.js');
const Travel = require('../model/travel.js');
require('dotenv').config().parsed;
const { validMail, validPhone } = require('../validator');

const router = Router();
const saltRounds = 5;

router.get('/', async (req, res) => {
  console.log(req.session.user);
  // await Travel.populate('user').execPopulate();
  const travels = await Travel.sortDate();
  await Promise.all(
    travels.map((elem) => elem.populate('organizator').execPopulate()),
  );

  await Promise.all(
    travels.map((elem) => elem.populate('users').execPopulate()),
  );
  const users = await User.find({});
  await Promise.all(
    users.map((elem) => elem.populate('travels').execPopulate()),

  );
  await Promise.all(
    users.map((elem) => elem.populate('organizator').execPopulate()),
  );
  console.log(req.session.user);
  res.render('index', { travels });
  // const response = await fetch(`https://api.rasp.yandex.net/v3.0/nearest_stations/?&format=json&lat=54.794&lng=56.036&distance=50&lang=ru_RU&station_types=platform&`, {
  //   headers: {
  //     "Authorization": process.env.API_RASP_KEY,
  //   },
  // });
  // const result = await response.json();
  // console.log(result);
  // console.log(process.env.API_KEY)
  // const response2 = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=a3f21227-7013-40bd-a081-c9091659ae59&format=json&geocode=54.7944793, 56.0376772`);
  // const result2 = await response2.json();
  // console.log(result2.response.GeoObjectCollection);

  // console.log(result);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user;
      res.redirect('/');
    } else {
      res.render('index', { message: 'Некорректные данные' });
    }
  } catch (e) {
    res.render('error', { message: 'Error' });
  }
});

router.post('/registration', async (req, res) => {
  const {
    name, firstname, email, phone,
  } = req.body;
  try {
    if (!validMail(email)) {
      return res.render('error', {
        message: 'Некорректный адрес электронной почты',
      });
    }
    if (!validPhone(phone)) {
      return res.render('error', {
        message: 'Неправильный формат номера телефона. Ориентировано на российские мобильные + городские с кодом из 3 цифр',
      });
    }
    const userFind = await User.findOne({ email });
    const userFindPhone = await User.findOne({ phone });
    if (userFind) {
      return res.render('error', {
        message: 'Пользователь с таким электронным адресом уже существует',
      });
    }
    if (userFindPhone) {
      return res.render('error', {
        message: 'Пользователь с таким телефонным номером уже существует',
      });
    }
    const password = await bcrypt.hash(req.body.password, saltRounds);
    const user = new User({
      name,
      firstname,
      email,
      password,
      phone,
    });
    await user.save();
    req.session.user = user;
    res.redirect('/');
  } catch (e) {
    console.log(e);
  }
});

router.get('/logout', async (req, res) => {
  try {
    await req.session.destroy();
    res.clearCookie('user_sid');
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
