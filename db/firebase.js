const admin = require('firebase-admin');
const dotenv = require('dotenv').config().parsed;

// Fetch the service account key JSON file contents
const serviceAccount = require('../serviceAccountKey.json');

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL,
  databaseAuthVariableOverride: null,
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
const db = admin.database();
const dbRef = db.ref();

function addReviewData(uid, review, email, author) {
  db.ref('reviews/').push({
    uid,
    email,
    text: review,
    author,
    data: new Date().toJSON(),
  });
}
const allReviews = (uid) => dbRef.child('reviews').get()
  .then((snapshot) => {
    if (snapshot.exists()) {
      const reviews = Object.values(snapshot.val());
      const result = reviews.filter((el) => el.uid === uid);
      return result;
    }
    console.log('No data available');
    return null;
  })
  .catch((error) => {
    console.error(error);
  });

function addPostData(uid, review, email, author, data, dateCmy, dateTime) {
  db.ref('posts/').push({
    uid,
    email,
    text: review,
    author,
    data,
    dateCmy,
    dateTime,
  });
}
const allPosts = (uid) => dbRef.child('posts').get()
  .then((snapshot) => {
    if (snapshot.exists()) {
      const reviews = Object.values(snapshot.val());
      const result = reviews.filter((el) => el.uid == uid);
      return result;
    }
    console.log('No data available');
    return null;
  })
  .catch((error) => {
    console.error(error);
  });

// await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.API_KEY}`, {
//     method: 'POST',
//     body: JSON.stringify({
//       email,
//       password,
//       returnSecureToken: true,
//     }),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   }).then((response) => response.json())
//     .then((data) => console.log)

// if (!req.body.email) return res.status(400).json({ error: 'missing email' });
// if (!req.body.password) return res.status(400).json({ error: 'missing password' });
// const { name, email, password } = req.body;
// console.log(req.body);
// await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.API_KEY}`, {
//   method: 'POST',
//   body: JSON.stringify({
//     email,
//     password,
//     name,
//     returnSecureToken: true,
//   }),
//   headers: {
//     'Content-Type': 'application/json',
//   },
// }).then((response) => response.json())
//   .then((data) => addUserData(data.localId, name, email))

module.exports = {
  addReviewData, allReviews, addPostData, allPosts,
};
