var mongoose = require('mongoose');
var validator = require('validator');
const jwt = require('jsonwebtoken');
const _= require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,  
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate:{
            validator: (value) => {
                return validator.isEmail(value)
            },
            message: '{VALUE} email is not a valid email!'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
    },
    tokens: [{
        access: {
            type: String,
            require: true,
        },
        token: {
            type: String,
            require: true,
        },
    }]
});

UserSchema.pre('save', function(next) {
    var user = this;
    if (user.isModified('password')){
        bcrypt.genSalt(10,(err, salt) => {
            bcrypt.hash(user.password, salt,(erra, hash) => {
                if(!erra){
                    user.password = hash
                    next();
                }
            })
        })
    } else{
        next();
    }
});

UserSchema.methods.toJSON = function() {
    var user = this;
    var objUser = user.toObject()
    return _.pick(objUser,['_id', 'email']);
}

UserSchema.methods.removeToken = function(token) {
    var user = this;
    return user.update({
        $pull: {
            tokens: { token }
        },
    })
}

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
    console.log(`token ${token}`)
    user.tokens.push({access, token});

    return user.save().then(() => {
        console.log(JSON.stringify(user.tokens));
        return token;
    })
}

UserSchema.statics.findToken = function(token) {
    var user = this;
    console.log(JSON.stringify(User))
    var decoded;
    try{
        decoded = jwt.verify(token, 'abc123')
    }catch(e){
        return Promise.reject(e)
    }
    return user.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth',
    })
}

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;
    return User.findOne({
        'email': email,
    }).then((user) => {
        if(!user){
            return Promise.reject()
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password,(err, resp) => {
                if(resp){
                    resolve(user)
                } else{
                    reject()
                }
                
            })
        })
    }).catch((e) => {return Promise.reject(e)})
}

var User = mongoose.model('User',UserSchema)

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