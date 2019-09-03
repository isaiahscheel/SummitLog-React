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
                    likeCount: doc.data().likeCount,
                    userImage: doc.data().userImage
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
        userImage: req.user.imageUrl,
        likeCount: 0,
        commentCount: 0
    }

    db
        .collection('hikes')
        .add(newHike)
        .then((doc) => {
            const resHike = newHike;
            resHike.hikeId = doc.id;
            res.json(resHike);
        })
        .catch((err) => {
            res.status(500).json({ error: 'Something went wrong' });
            console.error(err);
        });
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
         return res.status(400).json({comment: 'Must not be empty'});
     }
     const newComment = {
         body: req.body.body,
         createdAt: new Date().toISOString(),
         hikeId: req.params.hikeId,
         userHandle: req.user.handle,
         userImage: req.user.imageUrl
     };
     let flag = true;
     db.doc(`/hikes/${req.params.hikeId}`).get()
        .then(doc => {
            if(!doc.exists){
                flag = false;
                return res.status(404).json({error: 'Hike not found'});
            }
            else{
                return doc.ref.update({commentCount: doc.data().commentCount + 1});
            }
        })
        .then(() => {
            if(flag){
                return db.collection('comments').add(newComment);
            }
        })
        .then(() => {
            res.json(newComment);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: 'Something went wrong'});
        })
 }

 /**
  * 
  */
 exports.likeHike = (req, res) => {
     const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
        .where('hikeId', '==', req.params.hikeId).limit(1);

        const hikeDocument = db.doc(`/hikes/${req.params.hikeId}`);

        let hikeData;

        hikeDocument.get()
            .then((doc) => {
                if(doc.exists){
                    hikeData = doc.data();
                    hikeData.hikeId = doc.id;
                    return likeDocument.get();
                }
                else{
                    return res.status(404).json({error: 'Hike not found'})
                }
            })
            .then((data) => {
                if(data.empty){
                    return db.collection('likes').add({
                        hikeId: req.params.hikeId,
                        userHandle: req.user.handle
                    })
                    .then(() => {
                        hikeData.likeCount++;
                        return hikeDocument.update({likeCount: hikeData.likeCount});
                    })
                    .then(() => {
                        return res.json(hikeData);
                    })
                }
                else{
                    return res.status(400).json({error: 'Hike already liked'});
                }
            })
            .catch(err => {
                res.status(500).json({error: err.code});
            });
 }

 /**
  * Unlike a specified hike
  */
 exports.unlikeHike = (req, res) => {
    const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
    .where('hikeId', '==', req.params.hikeId).limit(1);

    const hikeDocument = db.doc(`/hikes/${req.params.hikeId}`);

    let hikeData;

    hikeDocument.get()
        .then((doc) => {
            if(doc.exists){
                hikeData = doc.data();
                hikeData.hikeId = doc.id;
                return likeDocument.get();
            }
            else{
                return res.status(404).json({error: 'Hike not found'})
            }
        })
        .then((data) => {
            if(data.empty){
                return res.status(400).json({error: 'Hike not liked'});
            }
            else{
                return db.doc(`/likes/${data.docs[0].id}`).delete()
                .then(() => {
                    hikeData.likeCount--;
                    return hikeDocument.update({likeCount: hikeData.likeCount});
                })
                .then(() => {
                    return res.json(hikeData);
                });
            }
        })
        .catch(err => {
            res.status(500).json({error: err.code});
        });
 }

exports.deleteHike = (req, res) => {
   const hikeDocument = db.doc(`/hikes/${req.params.hikeId}`);
   hikeDocument.get()
   .then((doc) => {
       if(doc.exists){
           if(doc.data().userHandle !== req.user.handle){
               return res.status(403).json({error: 'Unauthorized'});
           }
           return hikeDocument.delete();
       }
       else{
           return res.status(404).json({error: 'Hike not found'})
       }
   })
   .then(() => {
    db.collection(`likes`).where('hikeId', '==', req.params.hikeId).get()
    .then((data) => {
            data.forEach(doc => {
                doc.ref.delete();
            });
    });
   })
   .then(() => {
    db.collection(`comments`).where('hikeId', '==', req.params.hikeId).get()
    .then((data) => {
            data.forEach(doc => {
                doc.ref.delete();
            });
    });
   })
   .then(() => {
    db.collection(`notifications`).where('hikeId', '==', req.params.hikeId).get()
    .then((data) => {
            data.forEach(doc => {
                doc.ref.delete();
            });
    });
   })
   .then(() => {
       res.json({message: 'Hike deleted successfully'});
   })
   .catch(err => {
       console.error(err);
       return res.status(500).json({error: err.code});
   })

}
