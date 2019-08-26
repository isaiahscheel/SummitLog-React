const functions = require('firebase-functions'); /* Requiring firebase */
const app = require('express')(); /* Requiring express */

const FBAuth = require('./util/fbAuth'); /* Firebase Authorization Middle-Ware */

const {getAllHikes, postHike } = require('./handlers/hikes'); /* getAllHikes and postHike Requests */
const {signup, login} = require('./handlers/users');/* signup and login Requests */

/*
    Request to get all the hikes
    Located in functions/handlers/hike.js
*/
app.get('/hikes', getAllHikes);
/*
    Request to post a hike
    Located in functions/handlers/hike.js
*/
app.post('/hike', FBAuth, postHike);
/*
    Request to sign up
    Located in functions/handlers/users.js
*/
app.post('/signup', signup);
/*
   Request to login
   Located in functions/handlers/users.js
*/
app.post('/login', login);

/*
    This exports the requests with Expressjs. Makes them all neat and tidy under one function in the Firebase 
*/
exports.api = functions.https.onRequest(app);