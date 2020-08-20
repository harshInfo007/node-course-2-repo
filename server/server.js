require('./config/config');

const _ = require('lodash');
var express = require('express')
var bodyParser = require('body-parser')
var { ObjectId }= require('mongodb');
var { mongoose }= require('./db/mongoos');
var { Todo } = require('./models/todo');
var { User} = require('./models/user');
var { authenticate } = require('./middleware/authenticate');
const { json } = require('express');

var app = express();
const port = process.env.PORT

app.use(bodyParser.json())

app.post('/todos', authenticate,(req,resp) => {
    var todo = new Todo({
        text: req.body.text,
        _createdBy: req.user._id,
    })
    todo.save().then((doc) => {
        resp.send(doc)
    },(e) => {
        resp.status(400).send(e)
    })
    console.log(req.body);
})

app.get('/todos', authenticate,(req,resp) => {
    Todo.find({
        _createdBy: req.user._id,
    }).then((todos) => {
        resp.send({
            todos,
        })
    },(err) => {
        resp.status(400).send(err)
    })
})

app.get('/todos/:todoId',authenticate, (req,resp) => {
    // resp.send(req.params)
    if(!ObjectId.isValid(req.params.todoId)) {
        resp.status(400).send({ error: 'id is not valid one'})
    } else{
        // Todo.findById({ _id: req.params.todoId}).then((todo) => {
        //     resp.send({
        //         todo,
        //         message: 'todo is fetched successfully.'
        //     })
        // }).catch((e) => {resp.send({
        //     ...e,
        //     errorMessage: 'todo is fetched successfully.'
        // })})
        Todo.findOne({
            _id: req.params.todoId,
            _createdBy: req.body._id
        }).then((todo) => {
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

app.delete('/todos/:todoId', authenticate, (req,resp) => {
    // resp.send(req.params)
    if(!ObjectId.isValid(req.params.todoId)) {
        resp.status(400).send({ error: 'id is not valid one'})
    } else{
        // Todo.findByIdAndRemove({ _id: req.params.todoId}).then((todo) => {
        //     console.log(todo)
        //     if(todo){
        //         resp.send({
        //             todo,
        //             message: 'todo is deleted successfully.'
        //         })
        //     } else {
        //         resp.status(400).send({
        //             error: 'Id is not available'
        //         })
        //     }
        // }).catch((e) => {resp.send({
        //     ...e,
        //     errorMessage: 'todo is fetched successfully.'
        // })})
        Todo.findOneAndRemove({
            _id: req.params.todoId,
            _createdBy: req.user._id,
        }).then((todo) => {
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

app.patch('/todos/:todoId', authenticate, (req,resp) => {
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

        Todo.findOneAndUpdate({_id: id, _createdBy: req.user._id}, {$set: body}, {new: true}).then((todo) => {
            if(!todo){
                return resp.status(400).send()
            }
            resp.send({todo})
        }).catch((e) => {
            resp.status(400).send(e)
        })

        // Todo.findByIdAndUpdate({id}, {$set: body}, {new: true}).then((todo) => {
        //     if(!todo){
        //         return resp.status(400).send()
        //     }
        //     resp.send({todo})
        // }).catch((e) => {
        //     resp.status(400).send(e)
        // })
    }
})


//USERS OPERATION
app.post('/users',(req,resp) => {
    var body = _.pick(req.body, ["email", "password"])
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

app.post('/users/login', (req,resp) => {
    var body = _.pick(req.body, ["email", "password"])

    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            resp.header('x-auth', token).send(user)
        });
    }).catch((e) => {
      resp.status(400).send(e)
    })
})

app.delete('/users/logout', authenticate, (req,resp) => {

    req.user.removeToken(req.token).then((user) => {
        resp.send({ message: "logout successfully."})
    }).catch((e) => {
      resp.status(401).send()
    })
})

app.listen(port, () => {
    console.log(`started port ${port}`);
})

exports.default = {app}


