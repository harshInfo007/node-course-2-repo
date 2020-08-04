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
    const userCollection = db.collection(tblUser);

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
    // todoCollection.findOneAndUpdate({ 
    //     _id: new ObjectId('5f201a52cf1d36829824e75b')
    //  },
    //  {
    //     $set:{
    //         completed: false
    //     }
    // },{
    //     returnOriginal: false
    // }
    //  ).then((result) => {
    //     console.log(result);
    //     client.close();
    // },(errDelete) => {
    //     assert.equal(null, errDelete);
    //     client.close();
    // });

    userCollection.findOneAndUpdate({ 
        _id: new ObjectId('5f2018b063e2a625857c6a20')
     },
     {
        $inc: { age: -1 }
    },{
        returnOriginal: false
    }
     ).then((result) => {
        console.log(result);
        client.close();
    },(errDelete) => {
        assert.equal(null, errDelete);
        client.close();
    });


});