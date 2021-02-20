const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

router.use(bodyParser.json());

router.get('/get/:id?', async (request, response, next) => {
  const dbo = request.app.locals.db.db('todo_db');
  if (request.params.id) {
    const query = { _id: new mongodb.ObjectId(request.params.id) };
    const data = await dbo.collection('todos').findOne(query, {sort: {timeStamp: 1}});
    response.status(200).json({
      todo: data
    });
    return;
  }
  let resArr = [];
  const data = await dbo.collection('todos').find({}, {sort: {timeStamp: 1}});
  await data.forEach(item => {
    resArr.push(item);
  });
  response.status(200).json({
    todos: resArr
  });
});

router.post('/add', (request, response, next) => {
  const dbo = request.app.locals.db.db('todo_db');
  let myObj = request.body;
  dbo.collection('todos').insertOne(myObj, function(err, res) {
    if (err) throw err;
    console.log('MONGO RES', res.ops[0]._id);
    response.status(201).json({
      addedId: res.ops[0]._id
    });
  });
});

router.delete('/delete/:id', (request, response, next) => {
  const dbo = request.app.locals.db.db('todo_db');
  const query = { _id: new mongodb.ObjectId(request.params.id) };
  dbo.collection('todos').deleteOne(query, (err, obj) => {
    if (err) throw err;
    response.status(202).json({
      deletedId: request.params.id
    });
  })
});

module.exports = router;