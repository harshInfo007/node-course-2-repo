const { mongoose } = require('../server/db/mongoos');
const { Todo } = require('../server/models/todo');
const { ObjectId } = require('mongodb');

if(!ObjectId.isValid()) {
    const id = "5f2a7734c314dc158dbb2595";

    Todo.find({ _id: id }).then((todos) => {
        console.log(todos);
    })
    
    Todo.findOne({ _id: id }).then((todo) => {
        console.log(todo);
    })
    
    Todo.findById({ _id: id }).then((todo) => {
        console.log(todo);
    })
}