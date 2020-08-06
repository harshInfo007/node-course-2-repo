var express = require('express')
var bodyParser = require('body-parser')
var { ObjectId }= require('mongodb');
var { mongoose }= require('./db/mongoos');
var { Todo } = require('./models/todo');
var { User} = require('./models/user');

var app = express();

app.use(bodyParser.json())

app.post('/todos',(req,resp) => {
    var todo = new Todo({
        text: req.body.text,
    })
    todo.save().then((doc) => {
        resp.send(doc)
    },(e) => {
        resp.status(400).send(e)
    })
    console.log(req.body);
})

app.get('/todos',(req,resp) => {
    Todo.find().then((todos) => {
        resp.send({
            todos,
        })
    },(err) => {
        resp.status(400).send(err)
    })
})

app.listen(3000, () => {
    console.log('started port 3000');
})

app.get('/todos/:todoId',(req,resp) => {
    // resp.send(req.params)
    if(!ObjectId.isValid(req.params.todoId)) {
        resp.status(400).send({ error: 'id is not valid one'})
    } else{
        Todo.findById({ _id: req.params.todoId}).then((todo) => {
            resp.send({
                todo,
                message: 'todo is fetched successfully.'
            })
        }).catch((e) => {resp.send({
            ...e,
            errorMessage: 'todo is fetched successfully.'
        })})
    }
})

exports.default = {app}


