const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

admin.initializeApp();
var firebaseConfig = {
    apiKey: "AIzaSyAD5NMpc6_F2rNBHVylscsvYrfemXSKlrY",
    authDomain: "summitlog-react.firebaseapp.com",
    databaseURL: "https://summitlog-react.firebaseio.com",
    projectId: "summitlog-react",
    storageBucket: "summitlog-react.appspot.com",
    messagingSenderId: "779922633606",
    appId: "1:779922633606:web:af7a9fec4432e831"
  };

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

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

app.post('/signup', (req,res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };
    //TODO: Validate data

    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then((data) => {
                return res
                .status(201)
                .json({message: `user ${data.user.uid} signed up successfully`}); 
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({error: err.code});
            });
});
exports.api = functions.https.onRequest(app);