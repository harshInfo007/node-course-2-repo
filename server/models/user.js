var mongoose = require('mongoose');

var User = mongoose.model('User',{
    email: {
        type: String,  
        required: true,
        minLength: 1,
        trim: true,
    },
    password: {
        type: String,
        default: '',
    },
})

module.exports = {
    User
}

// var user1 = new User({
//     email: 'harsh@gmail.com',
//     password: false,
// });
// user1.save().then((doc) => {
//     console.log(doc);
// },(e) => {
//     console.log(JSON.stringify(e))
// })