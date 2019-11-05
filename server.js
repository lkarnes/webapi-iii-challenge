const express = require('express');
const postRouter = require('./posts/postRouter.js');
const userRouter = require('./users/userRouter.js');
const postDb = require('./posts/postDb.js');

const server = express();

server.use(express.json())

function logger(req, res, next) {
console.log([new Date().toISOString()], ` ${req.method}, ${req.url}`)
next();
};

server.use(logger)
server.use('/users', userRouter);

server.get('/', (req, res) => {
  res.json(`Let's write some middleware!`)
});

server.get('/posts', (req, res) => {
  postDb.get().then(post=>{
      res.json(post)
  })
  });


//custom middleware





module.exports = server;
