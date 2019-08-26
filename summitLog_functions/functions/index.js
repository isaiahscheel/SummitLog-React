const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
/*
    Connecting the Firebase instance to this app
*/
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
/*
    Firebase object
*/
const db = admin.firestore();
/*
    Request to get all the hikes
*/
app.get('/hikes', (req, res) => {
    db
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
/*
    Request to post a hike
*/
app.post('/hike', (req, res) => {
    const newHike = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString(),
    }

    db
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
/*
    Helper method to check if the email is empty or just white space
    --> Not too sure why we would do this server side and not just do this within the react app but we will see.
*/
const isEmpty = (string) => {
    if (string.trim() == '') {
        return true;
    }
    else {
        return false;
    }
}
/*
    Helper method to Check if an email is really an email. Found the Regular Expression online pretty easily
    --> Still Not too sure why we would do this server side and not just do this within the react app but we will see.
*/
const isEmail = (email) => {
    const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) {
        return true;
    }
    else {
        return false;
    }
}
/*
    Request to sign up
*/
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };
    /*
        Empty error object to hold our error messages
    */
    let errors = {};
    /*
        Check if the email is empty
    */
    if (isEmpty(newUser.email)) {
        errors.email = 'Must not be empty';
    }
    /*
        Check if the email is really on email
    */
    else if (!isEmail(newUser.email)) {
        errors.email = 'Must be a valid email address';
    }
    /*
        Check if the password is empty
    */
    if (isEmpty(newUser.password)) {
        errors.password = 'Must not be empty';
    }
    /*
        Check if the passwords match
    */
    if (newUser.password !== newUser.confirmPassword) {
        errors.confirmPassword = 'Passwords must match';
    }
    /*
        Check if the handle is empty
    */
    if (isEmpty(newUser.handle)) {
        errors.handle = 'Must not be empty';
    }
    /*
        Check to see if we have any errors in our object
    */
    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    // TODO: Validate data
    let token, userId;
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({ handle: 'this handle is already taken' });
            }
            else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(idToken => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            }
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ token });
        })
        .catch((err) => {
            console.error(err);
            if (err.code == 'auth/email-already-in-use') {
                return res.status(400).json({ email: 'Email is already in use' });
            }
            else {
                return res.status(500).json({ error: err.code });
            }
        });
});
/*
   Request to login
*/
app.post('/login', (req, res) =>{
    const user = {
        email: req.body.email,
        password: req.body.password
    };
    let errors = {};

    if(isEmpty(user.email)){
        errors.email = 'Must not be empty';
    }
    if(isEmpty(user.password)){
        errors.password = 'Must not be empty';
    }

    if(Object.keys(errors).length > 0){
        return res.status(400).json(errors);
    }

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({token});
        })
        .catch(err =>{
            console.error(err);
            return res.status(500).json({error: err.code});
        });

});
/*
    This exports the requests with Expressjs. Makes them all neat and tidy under one function in the Firebase 
*/
exports.api = functions.https.onRequest(app);