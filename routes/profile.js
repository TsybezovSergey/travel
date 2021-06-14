const { Router } = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/user.js');
const { sessionChecker } = require('../middleware/auth');
const user = require('../model/user.js');

const saltRounds = 5;
// const dotenv = require('dotenv').config().parsed;

const router = Router();

router.get('/', sessionChecker, async (req, res) => {
  const { email } = req.session.user;
  const userBD = await User.findOne({ email });

  res.render('profile', { userBD });
});
router.post('/', sessionChecker, async (req, res) => {
  try {
    const emailSession = req.session.user.email;
    console.log(req.body)
    const userBD = await User.findOne({ email: emailSession });
    const userCheck = await User.findOne({ email: req.body.email });
    if (!userCheck && userBD._id != userCheck._id) {
      res.render('profile', { userBD, message: 'Пользователь с таким email уже существует' });
    } else {
      const {
        name, firstname, email, password, phone,
      } = req.body;
      const newpassword = await bcrypt.hash(password, saltRounds);
      console.log(newpassword);
      await userBD.updateOne({
        name, firstname, email, password: newpassword, phone,
      });
      console.log(userBD, password);
      res.render('sucsess', { message: 'Изменения сохранены' });
    }
  } catch (e) {
    console.log(e);
    res.render('error', { message: 'Что-то пошло не так' });
  }
});
router.delete('/:id/photo', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findOneAndUpdate({ _id: id }, {
      url: '',
    }, { returnOriginal: false });
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
});
module.exports = router;
