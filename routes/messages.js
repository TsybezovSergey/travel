const { Router } = require('express');
const User = require('../model/user.js');
const Travel = require('../model/travel.js');
const { sessionChecker } = require('../middleware/auth');
const { allPosts } = require('../db/firebase');
require('dotenv').config().parsed;

const router = Router();

router.route('/').get(sessionChecker, async (req, res) => {
  try {
    const { email } = req.session.user;
    const userBD = await User.findOne({ email });

    const posts = await allPosts(userBD.organizator);
    // await userBD.populate('travels').execPopulate();
    // await userBD.populate('organizator').execPopulate();
    // await Promise.all(
    //   userBD.travels.map((elem) => elem.populate('organizator').execPopulate()),
    // );
    posts.reverse()

    res.render('messages', { posts });
  } catch (e) {
    res.render({ message: 'Не удалось...' });
  }
});

module.exports = router;
