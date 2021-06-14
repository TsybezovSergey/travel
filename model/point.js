const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  latitude: {
    type: String,
  },
  longitude: {
    type: String,
  },
  name: {
    required: true,
    unique: true,
    type: String,
  },
});

module.exports = mongoose.model('Point', pointSchema);
