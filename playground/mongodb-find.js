const { MongoClient, ObjectId } = require('mongodb');

const test = require('assert');

// Connection url

const url = 'mongodb://localhost:27017';
const dbName = 'TodoApp';
const dbUser = "Users";

console.log(new ObjectId())

// Connect using MongoClient

MongoClient.connect(url, (err, client) => {
    if(err){
        return console.log("not able to create connection with database");
    }
    console.log("Connection is established.");
    const db = client.db(dbName)
    // db.collection('Todos').find({_id: new ObjectId("5f200ddacf1d36829824e42b")}).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2))
    // },(errFetch) => {
    //     console.log('Unable to fetch todos', errFetch)
    // })
    db.collection('Todos').find().count().then((count) => {
        console.log(`count of todos ${count}`);
    },(errFetch) => {
        console.log('Unable to fetch todos', errFetch)
    })
    // client.close();

});