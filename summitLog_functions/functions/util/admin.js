const admin = require('firebase-admin');
/*
    Connecting the Firebase instance to this app
*/
admin.initializeApp();
/*
    Firebase object
*/
const db = admin.firestore();

module.exports = {admin, db};