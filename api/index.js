
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const CONNECTION_URL = process.env.CONNECTION_URL;
const DATABASE_NAME = process.env.DATABASE_NAME;
const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

var database, recipe_collection;
//* GET methods

//* GET all recipes
app.get('/api/recipes', (req, res) => {
    recipe_collection.find({}).toArray((error, result) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
})

//* GET recipe by object id
app.get('/api/recipes/:_id', (req, res) => {
    var _id = req.params._id;
    recipe_collection.find({"_id": ObjectId(_id)}).toArray((error, result) => {
        if(error){
            return res.status(500).send(error);
        }
        res.send(result);
    });
})

//* GET recipes by meal
app.get('/api/recipes/:meal', (req, res) => {
    var meal = req.params.meal;

    recipe_collection.find({ "meal": meal}).toArray( (error, result) => {
        if(error){
            return res.status(500).send(error);
        }
        res.send(result);
    });
})


//* GET recipe by title
app.get('/api/recipes/:title', (req, res) => {
    var title = req.params.title;

    recipe_collection.find({ "title": title}).toArray( (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
})

//* GET recipes by type
app.get('/api/recipes/:type', (req, res) => {
    var type = req.params.type;

    recipe_collection.find({ "type": type}).toArray( (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
})

//* GET recipes by cuisine
app.get('/api/recipes/:cuisine', (req, res) => {
    var cuisine = req.params.cuisine;

    recipe_collection.find({ "cuisine": cuisine}).toArray( (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
})

//* GET recipes by "Protein source"

//* POST methods - Create new recipe
app.post('/api/recipes', (req, res) => {
    recipe_collection.insertOne(req.body, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(req.body);
    });
})

//* PUT methods - Update a recipe
app.put('/api/recipes/:_id', (req, res) => {

    var myquery = { _id: ObjectId(req.body.recipe._id) };

    delete req.body.recipe._id;
    var new_values = { $set: req.body.recipe };

    recipe_collection.updateOne(myquery, new_values, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result.result);
    })
})

//* DELETE methods
app.delete('/api/recipes/:_id', (req, res) => {
    var _id = req.params._id;

    recipe_collection.deleteOne({"_id": ObjectId(_id)}, (error, result) => {
        if(error){
            return res.status(500).send(error);
        }
        res.send(result.result);
    })
})

//* ALL methods
app.all('*', (req,res) => {
    res.status(404).send('<h1>Resource not found</h1>');
})

app.listen(port, () => {
    MongoClient.connect(CONNECTION_URL, {useNewUrlParser: true}, (error, client) => {
        if (error) throw error;
        database = client.db(DATABASE_NAME);
        recipe_collection = database.collection("recipes");
    })
    console.log(`Connected to ${DATABASE_NAME}`);
    console.log(`Listening on port ${port}`);
})