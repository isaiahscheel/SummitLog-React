const functions = require('firebase-functions'); /* Requiring firebase */
const app = require('express')(); /* Requiring express */

const FBAuth = require('./util/fbAuth'); /* Firebase Authorization Middle-Ware */

const {getAllHikes, postHike, getHike, commentOnHike, likeHike, unlikeHike, deleteHike } = require('./handlers/hikes'); /* getAllHikes and postHike Requests */
const {signup, login, uploadImage, addUserDetails, getAuthenticatedUser} = require('./handlers/users');/* signup and login Requests */

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
   Request to upload iamges
   Located in functions/handlers/users.js
*/
app.post('/user/image', FBAuth, uploadImage);
/*
   Request to add user details
   Located in functions/handlers/users.js
*/
app.post('/user', FBAuth, addUserDetails),
/*
   Get user data
   Located in functions/handlers/users.js
*/
app.get('/user', FBAuth, getAuthenticatedUser);
/*
   Get a specified hike including comments
   Located in functions/handlers/hikes.js
*/
app.get('/hike/:hikeId', getHike);
/**
 * Request to delete a hike. Owner of hike is only allowed to delete the hike
 */
app.delete('/hike/:hikeId/delete', FBAuth, deleteHike);
/*
   Request to like a hike
   Located in functions/handlers/users.js
*/
app.post('/hike/:hikeId/like', FBAuth, likeHike);
app.post('/hike/:hikeId/unlike', FBAuth, unlikeHike);
/*
   Post a comment on a specified hike
   Located in functions/handlers/hikes.js
*/
app.post('/hike/:hikeId/comment', FBAuth, commentOnHike);

/*
    This exports the requests with Expressjs. Makes them all neat and tidy under one function in the Firebase 
*/
exports.api = functions.https.onRequest(app);