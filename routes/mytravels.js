const { Router } = require('express');
const User = require('../model/user.js');
const Travel = require('../model/travel.js');
const { sessionChecker } = require('../middleware/auth');
const { addPostData, allPosts } = require('../db/firebase');
require('dotenv').config().parsed;

const router = Router();

router.route('/').get(sessionChecker, async (req, res) => {
  try {
    const { email } = req.session.user;
    const userBD = await User.findOne({ email });

    await userBD.populate('travels').execPopulate();
    await userBD.populate('organizator').execPopulate();
    await Promise.all(
      userBD.travels.map((elem) => elem.populate('organizator').execPopulate()),
    );
      
    res.render('mytravels', { userBD });
  } catch (e) {
    res.render({ message: 'Не удалось...' });
  }
});

module.exports = router;
