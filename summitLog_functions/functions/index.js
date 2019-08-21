const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
 exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello World");
 });

 exports.getHikes = functions.https.onRequest((req, res) => {
    admin.firestore().collection('hikes').get().then(data => {
        let hikes = [];
        data.forEach(doc => {
            hikes.push(doc.data());
        });
        return res.json(hikes);
    })
    .catch(err => console.error(err));
 })

 exports.createHike = functions.https.onRequest((req, res) => {
     
 })