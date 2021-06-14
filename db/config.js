const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/dbProject'

const dbConnection = () => mongoose.connect(url, {
  useNewUrlParser: true,
  useFindAndModify: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  poolSize: 10,
  bufferMaxEntries: 0,
}).then(() => console.log('sucsess connect to mongoose!'))
  .catch(() => console.log('error connect to mongoose'));

module.exports = dbConnection;
