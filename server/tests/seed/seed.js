const { ObjectId } = require('mongodb');
const { Todo } = require('../../models/todo');


const todos = [{
    _id: new ObjectId,
    text: "First test todo",
},{
    _id: new ObjectId,
    text: "Second test todo",
    completed: true,
    completedAt: 333,
}
]

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done()).catch((err) => {
        console.log(err)
        done();
    });
}

module.exports = {
    todos,
    populateTodos,
}