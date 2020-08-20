const { User } = require('../models/user');

var authenticate = (req, resp, next) => {
    var token = req.header('x-auth');
    User.findToken(token).then((user) => {
        if(!user){
            return Promise.reject();
        }
        console.log(JSON.stringify(req.body));
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        resp.status(401).send(e);
    })
}

module.exports = { authenticate}