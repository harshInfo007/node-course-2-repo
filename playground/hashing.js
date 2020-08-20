const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id:10,
}

var token = jwt.sign(data, process.env.JWT_TOKEN);
console.log(token);

var decoded = jwt.verify(token, process.env.JWT_TOKEN)
console.log(decoded);

// var message = "I am user number 3";
// var hash = SHA256(message).toString();

// console.log(hash);