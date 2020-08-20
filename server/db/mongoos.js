var mongoose = require('mongoose');

const url = process.env.MONGODB_DATABASE;
const dbTodo = process.env.MONGODB_DATABASE;

mongoose.Promise = global.Promise;
mongoose.connect(`${url}/${dbTodo}`, {useNewUrlParser: true});

module.exports = {
    mongoose
}