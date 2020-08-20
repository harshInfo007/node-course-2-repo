var mongoose = require('mongoose');

var Todo = mongoose.model('Todo',{
    text: {
        type: String,  
        required: true,
        minLength: 1,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    _createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    completedAt: {
        type: Number,
        default: null,
    }
})

module.exports = {
    Todo
}

// var objTodo = new Todo({
//     text: 'Lunch',
// });
// objTodo.save().then((doc) => {
//     console.log(doc);
// },(e) => {
//     console.log(JSON.stringify(e))
// })

// var objTodo2 = new Todo({
//     text: 'Feed the dog',
//     completed: false,
//     completedAt: 123,
// });
// objTodo2.save().then((doc) => {
//     console.log(doc);
// },(e) => {
//     console.log(JSON.stringify(e))
// })