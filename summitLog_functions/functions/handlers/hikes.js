/**
 * File that handles all the hike related Requests
 * getAllHikes --> Get request, returns all the hikes posted
 * postHike --> Post request, requires a body and a header with the user's token, puts a hike into the firebase database
 */
const { db } = require('../util/admin');

/*
    Request to get all the hikes
*/
exports.getAllHikes = (req, res) => {
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
                    createdAt: doc.data().createdAt,
                    commentCount: doc.data().commentCount,
                    likeCount: doc.data().likeCount
                });
            });
            return res.json(hikes);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
}

/*
    Request to post a hike
*/
exports.postHike = (req, res) => {
    if (req.body.body.trim() == '') {
        return res.status(400).json({ body: 'Body must not be empty' });
    }
    const newHike = {
        body: req.body.body,
        userHandle: req.user.handle,
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
}

/**
 * Request to get a specific Hike
 */
exports.getHike = (req, res) => {
    let hikeData = {};
    db.doc(`/hikes/${req.params.hikeId}`).get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Hike not found' });
            }
            hikeData = doc.data();
            hikeData.hikeId = doc.id;
            return db.collection('comments').where('hikeId', '==', req.params.hikeId).orderBy('createdAt', 'desc').get();
        })
        .then((data) => {
            hikeData.comments = [];
            data.forEach((doc) => {
                hikeData.comments.push(doc.data());
            });
            return res.json(hikeData);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
}

/**
 * Comment on a specified hike
 */

 exports.commentOnHike = (req, res) => {
     if(req.body.body.trim() === ''){
         return res.status(400).json({error: 'Must not be empty'});
     }
     const newComment = {
         body: req.body.body,
         createdAt: new Date().toISOString(),
         hikeId: req.params.hikeId,
         userHandle: req.user.handle,
         userImage: req.user.imageUrl
     };

     db.doc(`/hikes/${req.params.hikeId}`).get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({error: 'Hike not found'});
            }
            return db.collection('comments').add(newComment);
        })
        .then(() => {
            res.json(newComment);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: 'Something went wrong'});
        })
 }