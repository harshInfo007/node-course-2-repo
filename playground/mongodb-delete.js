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
    const db = client.db(dbName);
    const todoCollection = db.collection(tblTodo);

    // delete many
    // todoCollection.deleteMany({text: 'Eat Lunch'}).then((result) => {
    //     console.log(result);
    //     client.close();
    // },(errDelete) => {
    //     assert.equal(null, errDelete);
    //     client.close();
    // });

    // delete one
    // todoCollection.deleteOne({text: 'Eat Lunch'}).then((result) => {
    //     console.log(result);
    //     client.close();
    // },(errDelete) => {
    //     assert.equal(null, errDelete);
    //     client.close();
    // });

    // find & delete
    todoCollection.findOneAndDelete({ completed: false }).then((result) => {
        console.log(result);
        client.close();
    },(errDelete) => {
        assert.equal(null, errDelete);
        client.close();
    });


});