const express = require('express')
const cors = require('cors')
const app = express()
const port = 8080
const mongoose = require('mongoose')

const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

const uri = process.env['MONGODB_URI'];

const options = {
   useUnifiedTopology: true,
   useNewUrlParser: true,
}

app.use(cors());

// parse application/json
app.use(express.json());

if (!uri) {
   throw new Error('Please add your Mongo URI to .env.local')
}

let client = new MongoClient(uri, options)

client.connect().then(() => {
  console.log("connect to db")
 
  app.get('/login', async (req, res) => {
    const db = client.db("ceskasporitelna");
    const users = await db.collection("users").find().toArray();
    res.send(users)
  })

  app.get('/', async (req, res) => {
    const db = client.db("ceskasporitelna");
    const articles = await db.collection("articles").find().toArray();
    res.send(articles)
  })

  app.post('/', async (req, res) => {
    const db = client.db("ceskasporitelna");
    const insert = await db.collection("articles").insertOne({
      name: req.body.name,
      published: req.body.published,
      updated: req.body.updated,
      author: req.body.author,
      text: req.body.text
    });
    res.send({success: "success"})
  })

  app.put('/', async (req, res) => {
    const db = client.db("ceskasporitelna");

    const update = await db.collection("articles").find({_id: mongoose.Types.ObjectId(req?.body?.id) }).toArray();

    if(update){
      const update = await db.collection("articles").updateOne({
        _id: mongoose.Types.ObjectId(req?.body?.id)
          }, {
              $set: {
                name: req.body.name,
                published: req.body.published,
                updated: req.body.updated,
                author: req.body.author,
                text: req.body.text
            }
          })
      }
    res.send({success: "success"})
  })


  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

})

