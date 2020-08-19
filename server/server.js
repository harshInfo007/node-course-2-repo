const _ = require('lodash');
var express = require('express')
var bodyParser = require('body-parser')
var { ObjectId }= require('mongodb');
var { mongoose }= require('./db/mongoos');
var { Todo } = require('./models/todo');
var { User} = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000

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

app.delete('/todos/:todoId',(req,resp) => {
    // resp.send(req.params)
    if(!ObjectId.isValid(req.params.todoId)) {
        resp.status(400).send({ error: 'id is not valid one'})
    } else{
        Todo.findByIdAndRemove({ _id: req.params.todoId}).then((todo) => {
            console.log(todo)
            if(todo){
                resp.send({
                    todo,
                    message: 'todo is deleted successfully.'
                })
            } else {
                resp.status(400).send({
                    error: 'Id is not available'
                })
            }
        }).catch((e) => {resp.send({
            ...e,
            errorMessage: 'todo is fetched successfully.'
        })})
    }
})

app.patch('/todos/:todoId',(req,resp) => {
    var id = req.params.todoId;
    var body = _.pick(req.body, ["text", "completed"])
    console.log(`params ${JSON.stringify(req.body)}`)
    console.log(`body ${JSON.stringify(body)}`)
    mongoose.set('useFindAndModify', false);

    if(!ObjectId.isValid(req.params.todoId)) {
        resp.status(400).send({ error: 'id is not valid one'})
    } else{
        if(_.isBoolean(body.completed) && body.completed){
            body.completedAt = new Date().getTime();
        } else{
            body.completed = false;
            body.completedAt = null;
        }

        Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
            if(!todo){
                return resp.status(400).send()
            }
            resp.send({todo})
        }).catch((e) => {
            resp.status(400).send(e)
        })
    }
})


//USERS OPERATION
app.post('/users',(req,resp) => {
    var body = _.pick(req.body, ["email", "password"])
    console.log(`params ${JSON.stringify(req.body)}`)
    console.log(`body ${JSON.stringify(body)}`)
    mongoose.set('useFindAndModify', false);

        var user = new User(body)
        user.save().then((user) => {
            if(!user){
                return resp.status(400).send()
            }
            return user.generateAuthToken();
        }).then((token) => {
            resp.header('x-auth', token).send(user)
        }).catch((e) => {
            resp.status(400).send(e)
        })
})

app.get('/users/me', authenticate, (req,resp) => {
    resp.send(req.user);
})

app.listen(port, () => {
    console.log(`started port ${port}`);
})

exports.default = {app}


