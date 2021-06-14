const { Router } = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/user.js');
// const dotenv = require('dotenv').config().parsed;
const router = Router();
require('dotenv').config().parsed;
const { addReviewData, allReviews } = require('../db/firebase');
const { sessionChecker } = require('../middleware/auth');

router.get('/:id/review', async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.session.user;
    const userBD = await User.findOne({ email });
    if (userBD._id == id) {
      return res.render('error', { message: 'Увы... нельзя оставить отзыв о себе' });
    }
    const user = await User.findOne({ _id: id });
    res.render('review', { userBD, user });
  } catch (e) {
    res.render('error', { message: 'Увы... не найдено... Возможно, профиль был удален' });
  }
});
router.post('/review', async (req, res) => {
  const { password, review, id } = req.body;
  const { email } = req.session.user;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      addReviewData(id, review, email, user.name);
      res.render('sucsess', { message: 'Спасибо, что оставили отзыв о пользователе' });
    } else {
      res.render('review', { message: 'неверный пароль, попробуйте ещё' });
    }
  } catch (e) {
    res.render('error', { message: 'Произошла какая-то ошибка... бывает' });
  }
});

router.get('/:id', sessionChecker, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userBD = await User.findOne({ _id: id });
    const reviews = await allReviews(id);
    const reviewsArray = [];
    if (reviews) {
      for (const elem of reviews) {
        const dateReviews = new Date(elem.data);
        const review = new Object({
          uid: elem.uid,
          emailReview: elem.email,
          dateReviews,
          dateCmy: new Date(dateReviews).toLocaleDateString(),
          dateTime: new Date(dateReviews).toLocaleTimeString().slice(0, 5),
          text: elem.text,
          author: elem.author,
          emailAuthor: elem.email,
        });
        reviewsArray.push(review);
      }
    }
    res.render('users', { userBD, reviewsArray });
  } catch (e) {
    res.render('error', { message: 'Увы... не найдено... Возможно, профиль был удален' });
  }
});

module.exports = router;
