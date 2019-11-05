const express = require('express');
const router = express.Router({mergeParams: true});
const db = require('./postDb.js');
const userDb = require('../users/userDb.js');

// router.get('/', (req, res) => {
// db.get().then(post=>{
//     res.json(post)
// })
// });
router.post('/', validatePost, (req, res) => {
    const userId = req.params.id;
    console.log(req.params.id)
    req.body.user_id = userId;

    db.insert(req.body).then(post => {
            res.status(201).json(post)
        })
        .catch(err => {
            res.status(400).json(err)
        })
});

router.get('/:postId', validateIds, (req, res) => {
    const id = req.params.postId;
    db.getById(id).then(post => {
        res.status(200).json(post);
    })
});

router.delete('/:postId', validateIds, (req, res) => {
    const id = req.params.postId;
    db.remove(id).then(resonse => {
        res.send("delete complete")
    })
});

router.put('/:postId', validateIds, (req, res) => {
    const postId = req.params.postId;
    const body = req.body;
    db.update(postId, body).then(post => {
        res.status(201).json(body)
    })
});

// custom middleware

function validateIds(req, res, next) {
    const postId = req.params.postId;
    const id = req.params.id;
    userDb.getById(id).then(user => {
        if(!user){
            res.status(400).json({message: "The user id in the route does not exist"})
        }else{
            db.getById(postId).then(post=> {
                if(!post){
                    res.status(400).json({message: "The post id in the route does not exist"})
                }else{
                    next();
                }
            })
        }
    })
};

function validatePost(req, res, next) {
    if(!req.body){
        res.status(400).json({message: "Post request require a body"})
    }else if(!req.body.text){
        res.status(400).json({message: "text field required for a new post"})
    }else{
        next();
    }
};

module.exports = router;