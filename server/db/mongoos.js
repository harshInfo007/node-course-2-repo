var mongoose = require('mongoose');

const url = 'mongodb://localhost:27017';
const dbTodo = 'TodoApp'

mongoose.Promise = global.Promise;
mongoose.connect(`${url}/${dbTodo}`, {useNewUrlParser: true});

module.exports = {
    mongoose
}