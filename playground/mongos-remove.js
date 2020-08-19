const { mongoose } = require('../server/db/mongoos');
const { Todo } = require('../server/models/todo');
const { ObjectId } = require('mongodb');

    // Todo.remove({}).then((todos) => {
    //     console.log(todos);
    // })
    
    // Todo.findOneAndRemove({ _id: id }).then((todo) => {
    //     console.log(todo);
    // })

    Todo.findByIdAndRemove({ _id: id }).then((todo) => {
        console.log(todo);
    })