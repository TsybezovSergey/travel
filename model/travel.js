const mongoose = require('mongoose');
const moment = require('moment');

const travelSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  organizator: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
  }],
  date: {
    type: Date,
    validate: {
      validator(value) {
        return value >= new Date();
      },
      message: 'Дата похода должна быть больше текущей даты',
    },
  },
  dateCmy: {
    type: String,
  },
  dateTime: {
    type: String,
  },
  coordinate: {
    type: String,
    required: true,
  },
  coordinate2: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
  },
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  timeOfTravel: {
    type: String,
  },
  distance: {
    type: String,
  },
  url: {
    type: String,
  },
  posts: {
    type: Array,
  },
});

travelSchema.statics.sortDate = function () {
  const today = moment().startOf('day');
  return this.find({
    date: {
      $gte: today.toDate(),
    },
  }).sort({ date: -1 }).exec();
};
module.exports = mongoose.model('Travel', travelSchema);
