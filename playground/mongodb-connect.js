const { MongoClient, ObjectId } = require('mongodb');

const test = require('assert');

// Connection url

const url = 'mongodb://localhost:27017';
const dbName = 'TodoApp';
const tblUser = "Users";
const tblTodo = "Todo";

console.log(new ObjectId())

// Connect using MongoClient

MongoClient.connect(url, (err, client) => {
    if(err){
        return console.log("not able to create connection with database");
    }
    console.log("Connection is established.");
    const db = client.db(dbName)
    // db.collection(tblTodo).insertOne({
    //     text: 'Learn Mongodb',
    //     completed: false,
    // },(errInsert, result) => {
    //     if(errInsert) {
    //        return console.log('Insert operation has some kind of issue', err)
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2))
    // })
    db.collection(tblUser).insertOne({
        name: 'Harsh',
        age: 27,
        location: 'abd',
    },(errInsert, result) => {
        if(errInsert) {
           return console.log('Insert operation has some kind of issue', err)
        }
        console.log(JSON.stringify(result.ops, undefined, 2))
    })
    client.close();

});