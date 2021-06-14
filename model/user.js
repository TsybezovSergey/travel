const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstname: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(value) {
        return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value);
      },
      message: 'is not a valid email!',
    },
  },
  raiting: {
    type: Number,
  },
  // phone: {
  //   type: String,
  //   validate: {
  //     validator(value) {
  //       return /^((8|\+7)[/\- ]?)?(\(?\d{3}\)?[/\- ]?)?[\d\- ]{7,10}$/.test(value);
  //     },
  //     message: 'is not a valid phone number!',
  //   },
  // },
  organizator: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Travel',
  },
  phone: {
    type: String,
    unique: true,
    validate: {
      validator(value) {
        return /^((8|\+7)[/\- ]?)?(\(?\d{3}\)?[/\- ]?)?[\d\- ]{7,10}$/.test(value);
      },
      message: 'is not a valid phone number!',
    },
  },
  travels: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Travel',
  }],
  password: { type: String, required: true },
  url: {
    type: String,
  },

});

module.exports = mongoose.model('User', userSchema);
