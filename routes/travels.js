const { Router } = require('express');
const fetch = require('node-fetch');
const User = require('../model/user.js');
const Travel = require('../model/travel.js');
const { sessionChecker } = require('../middleware/auth');
const { addPostData, allPosts } = require('../db/firebase');
const { findOne } = require('../model/user.js');
require('dotenv').config().parsed;
// const dotenv = require('dotenv').config().parsed;
const router = Router();

router.route('/').get(sessionChecker, async (req, res) => {
  const { email } = req.session.user;
  const user = await User.findOne({ email });

  if (req.session.user.organizator) {
    return res.redirect('/');
  }
  // if (!user.organizator){
  //   return res.render('error', { message: "Вы уже организовали поездку"})
  // }
  res.render('travels');
})
  .post(sessionChecker, async (req, res) => {
    try {
      const {
        name, date, count, from, to, timeOfTravel, distance,
      } = req.body;
      let { coordinate, coordinate2 } = req.body;
      if (date < new Date()) {
        return res.render('error', { message: 'Ошибка. Дата похода должна быть больше текущей даты' });
      }
      const regexObj = new RegExp(/башкортостан/gi);
      const { email } = req.session.user;
      if (!req.body.from.match(regexObj) || !req.body.to.match(regexObj)) {
        return res.render('error', { message: 'Привет, это приложение создано для путешествия по Башкортостану' });
      }
      const splitCoordinate = coordinate.split(',');
      const splitCoordinate2 = coordinate2.split(',');
      coordinate = (splitCoordinate.map((el) => (Number(el)).toFixed(6))).toString();
      coordinate2 = (splitCoordinate2.map((el) => (Number(el)).toFixed(6))).toString();
      const user = await User.findOne({ email });

      const dateCmy = new Date(date).toLocaleDateString();
      const dateTime = new Date(date).toLocaleTimeString().slice(0, 5);
      const travel = new Travel({
        name,
        organizator: user,
        users: [],
        date: new Date(date),
        dateCmy,
        dateTime,
        from,
        to,
        count,
        coordinate,
        coordinate2,
        timeOfTravel,
        distance,
      });
      await travel.save();
      await user.updateOne({ organizator: travel });
      req.session.user.organizator = travel;
      res.redirect(`travels/${travel._id}/new`);
    } catch (e) {
      if (e.date) {
        return res.render('error', { message: e.date });
      }
      console.log(e);
      res.render('error', { message: 'Произошла ошибка' });
    }
  });
router.route('/:id').delete(async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ organizator: id });


    user.populate('organizator').execPopulate();

    await user.save();
    const travel = await Travel.deleteOne({ _id: id });
    req.session.user.organizator = '';
    res.json({ status: 'Очень жаль, что путешествие не состоится' });
  } catch (e) {
    res.json({ status: 'Упссс, произошла ошибка' });
  }
})
  .get(sessionChecker, async (req, res) => {
    try {
      const { id } = req.params;

      const travel = await Travel.findOne({ _id: id });
      await travel.populate('organizator').execPopulate();
      await travel.populate('users').execPopulate();
      const { email } = req.session.user;

      const user = await User.findOne({ email });
      if (travel.organizator.email === email) {
        return res.render('travel', { travel, organizator: true });
      }
      res.render('travel', { travel });
    } catch (e) {
      console.log(e);
      res.render('error', { message: 'Упс... что-то пошло не так, скорее всего поездка уже не актуальна' });
    }
  });

router.route('/:id/join').get(async (req, res) => {
  try {
    const { id } = req.params;

    const travel = await Travel.findOne({ _id: id });
    const { email } = req.session.user;
    const user = await User.findOne({ email });

    const { users } = travel;
    if (users.includes(user._id)) {
      return res.json({ free: 'Вы уже присоединились' });
    }
    if (users.length < travel.count) {
      await travel.updateOne({ $push: { users: user } });
      await user.updateOne({ $push: { travels: travel } });
    } else {
      return res.json({ free: 'Все места уже заняты' });
    }
    return res.json({ status: 'ok' });
  } catch (e) {
    return res.sendStatus(500);
  }
});

router.route('/:id/new').get(async (req, res) => {
  try {
    const { id } = req.params;
    const travel = await Travel.findOne({ _id: id });
    await travel.populate('organizator').execPopulate();
    res.render('sucsess', { travel });
  } catch (e) {
    res.render('error', { message: 'Упс... что-то пошло не так' });
  }
});
router.route('/:id/out').put(async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.session.user;
    const user = await User.findOne({ email });
    const travel = await Travel.findOne({ _id: id });
    await travel.populate('users').execPopulate();
    await user.populate('travels').execPopulate();
    const newUsers = travel.users.filter((e) => e._id === id);
    const newTravels = user.travels.filter((e) => e._id === travel._id);

    await travel.updateOne({ $set: { users: newUsers } });
    await user.updateOne({ $set: { travels: newTravels } });

    res.json({ status: true, message: 'Успешно отменено' });
  } catch (e) {
    res.json({ message: 'Не удалось...' });
  }
});

router.route('/:id/ctx').post(sessionChecker, async (req, res) => {
  try {
    const { id } = req.params;
    const { ctx } = req.body;
    const { email } = req.session.user;
    const user = await User.findOne({ email });
    const author = user.name;
    const date = new Date().toJSON();
    const dateCmy = new Date(date).toLocaleDateString();
    const dateTime = new Date(date).toLocaleTimeString().slice(0, 5);
    await addPostData(id, ctx, email, author, date, dateCmy, dateTime);
    const msg = {
      id, ctx, email, author, dateCmy, dateTime,
    };
    const reviews = await allPosts(id);
    res.json(msg);
  } catch (e) {
    console.log(e);
    res.json({ message: 'Не удалось...' });
  }
});

router.route('/:id/edit').get(sessionChecker, async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.session.user;
    const user = await User.findOne({ email });
    const travel = await Travel.findOne({ _id: user.organizator });
    if (!travel) {
      return res.render('travelOrg');
    }
    const date = new Date(travel.date).toISOString().slice(0, 16);
    await travel.populate('users').execPopulate();
    res.render('travelOrg', { travel, date });
  } catch (e) {
    res.render('error', 'не удалось получить данные');
  }
});

router.route('/:id/edit').post(sessionChecker, async (req, res) => {
  try {
    const { id } = req.params;

    const {
      travelname, date, count, from, to, distance, timeOfTravel,
    } = req.body;

    let { coordinate, coordinate2 } = req.body;
    if (date < new Date()) {
      return res.render('error', { message: 'Ошибка. Дата похода должна быть больше текущей даты' });
    }
    const regexObj = new RegExp(/башкортостан/gi);
    if (!req.body.from.match(regexObj) || !req.body.to.match(regexObj)) {
      return res.render('error', { message: 'Привет, это приложение создано для путешествия по Башкортостану' });
    }
    const splitCoordinate = coordinate.split(',');
    const splitCoordinate2 = coordinate2.split(',');
    coordinate = (splitCoordinate.map((el) => (Number(el)).toFixed(6))).toString();
    coordinate2 = (splitCoordinate2.map((el) => (Number(el)).toFixed(6))).toString();

    const dateCmy = new Date(date).toLocaleDateString();
    const dateTime = new Date(date).toLocaleTimeString().slice(0, 5);

    await Travel.findOneAndUpdate({ _id: id },
      {
        $set: {
          name: travelname,
          date: new Date(date),
          count,
          from,
          to,
          distance,
          timeOfTravel,
          coordinate,
          coordinate2,
          dateCmy,
          dateTime,
        },
      });
    res.render('sucsess', { message: 'Ваши изменения успешно сохранены' });
  } catch (e) {
    res.render('error', 'не удалось получить данные');
  }
});

module.exports = router;
