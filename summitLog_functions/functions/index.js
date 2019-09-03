const functions = require('firebase-functions'); /* Requiring firebase */
const app = require('express')(); /* Requiring express */
const {db} = require('./util/admin');

const FBAuth = require('./util/fbAuth'); /* Firebase Authorization Middle-Ware */

const {getAllHikes, postHike, getHike, commentOnHike, likeHike, unlikeHike, deleteHike } = require('./handlers/hikes'); /* getAllHikes and postHike Requests */
const {signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationsRead} = require('./handlers/users');/* signup and login Requests */

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
/*
   Request to unlike a hike
   Located in functions/handlers/users.js
*/
app.post('/hike/:hikeId/unlike', FBAuth, unlikeHike);
/*
   Post a comment on a specified hike
   Located in functions/handlers/hikes.js
*/
app.post('/hike/:hikeId/comment', FBAuth, commentOnHike);
/*
   Get a specified user's data
   Located in functions/handlers/users.js
*/
app.get('/user/:handle', getUserDetails);
/*
   Mark a notification read
   Located in functions/handlers/users.js
*/
app.post('/notifications', FBAuth, markNotificationsRead);

/*
    This exports the requests with Expressjs. Makes them all neat and tidy under one function in the Firebase 
*/
exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore.document('likes/{id}').onCreate((snapshot) => {
   return db.doc(`/hikes/${snapshot.data().hikeId}`).get()
      .then((doc) => {
         if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
            return db.doc(`/notifications/${snapshot.id}`).set({
               createdAt: new Date().toISOString(),
               recipient: doc.data().userHandle,
               sender: snapshot.data().userHandle,
               type: 'like',
               read: 'false',
               hikeId: doc.id
            });
         }
      })
      .catch(err => 
         console.error(err));
});

exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}').onDelete((snapshot) => {
   return db.doc(`/notifications/${snapshot.id}`).delete()
      .catch((err) => {
         console.log(err);
         return;
      })
});

exports.createNotificationOnComment = functions.firestore.document('comments/{id}').onCreate((snapshot) => {
   return db.doc(`/hikes/${snapshot.data().hikeId}`).get()
      .then((doc) => {
         if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
            return db.doc(`/notifications/${snapshot.id}`).set({
               createdAt: new Date().toISOString(),
               recepient: doc.data().userHandle,
               sender: snapshot.data().userHandle,
               type: 'comment',
               read: 'false',
               hikeId: doc.id
            });
         }
      })
      .catch(err => {
         console.log(err);
         return;
      })
});

exports.onUserImageChange = functions
  .firestore.document('/users/{userId}')
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('image has changed');
      const batch = db.batch();
      return db
        .collection('hikes')
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const scream = db.doc(`/hikes/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

  
   exports.onHikeDelete = functions
  .firestore.document('/hikes/{hikeId}')
  .onDelete((snapshot, context) => {
    const hikeId = context.params.hikeId;
    const batch = db.batch();
    return db
      .collection('comments')
      .where('hikeId', '==', hikeId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection('likes')
          .where('hikeId', '==', hikeId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection('notifications')
          .where('hikeId', '==', hikeId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
   