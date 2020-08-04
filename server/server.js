var express = require('express')
var bodyParser = require('body-parser')

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

app.listen(3000, () => {
    console.log('started port 3000');
})


