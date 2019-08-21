const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

app.get('/hikes', (req, res) => {
    admin
    .firestore()
    .collection('hikes')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
        let hikes = [];
        data.forEach(doc => {
            hikes.push({
                hikeId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt
            });
        });
        return res.json(hikes);
    })
        .catch(err => console.error(err));
})

app.post('/hike', (req, res) => {
    const newHike = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString(),
    }

    admin
    .firestore()
    .collection('hikes')
    .add(newHike)
    .then((doc) => {
        res.json({ message: `document ${doc.id} created successfully` });
    })
        .catch((err) => {
            res.status(500).json({ error: 'Something went wrong' });
            console.error(err);
        })
});

exports.api = functions.https.onRequest(app);