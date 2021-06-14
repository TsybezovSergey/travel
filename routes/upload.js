const { Router } = require('express');
const firebase = require('firebase');
require('firebase/storage');
const Travel = require('../model/travel.js');
const User = require('../model/user.js');
// const dotenv = require('dotenv').config().parsed;
const router = Router();

router.post('/', async (req, res, next) => {
  try {
    if (req.body.travel) {
      const { id } = req.body;
      const url = req.body.travelUrl;
      const travel2 = await Travel.findOne({ _id: id });
      const travel = await Travel.findOneAndUpdate({ _id: id }, { $set: { url } }, { returnOriginal: false });
      res.json({ status: true });
      return;
    }
    const { email } = req.session.user;
    const url = req.body.userUrl;
    const user = await User.findOneAndUpdate({ email }, { $set: { url } }, { returnOriginal: false });
    res.json({ status: true });
  } catch (e) {
    res.json({});
  }
});

module.exports = router;
