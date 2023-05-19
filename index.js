const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6o5zgbq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect((error) => {
      if (error) {
        console.error(error);
        return;
      }
    });

    const carToysCollection = client.db("carToys").collection("toys");

    app.get("/toys", async (req, res) => {
      const limit = parseInt(req.query.limit);
      const cursor = carToysCollection.find().limit(limit);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/allToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carToysCollection.findOne(query);
      res.send(result);
    });

    // Get data for my toys by email
    app.get("/myToys", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { sellerEmail: req.query.email };
      }
      const result = await carToysCollection.find(query).toArray();
      res.send(result);
    });

    // Category data get here
    app.get("/toys/:category", async (req, res) => {
      const category = req.params.category;
      let query = { subCategory: category };
      const result = await carToysCollection.find(query).toArray();
      res.send(result);
    });

    // get single toy information
    app.get("/myToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carToysCollection.findOne(query);
      res.send(result);
    });

    app.get("/searchToy", async (req, res) => {
      const searchTxt = req.query.search;
      const query = { name: searchTxt };
      const result = await carToysCollection.find(query).toArray();
      res.send(result);
    });

    // Add toys function here
    app.post("/toys", async (req, res) => {
      const toys = req.body;
      const result = await carToysCollection.insertOne(toys);
      res.send(result);
    });

    // Delete my toys item from table
    app.delete("/myToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carToysCollection.deleteOne(query);
      res.send(result);
    });

    // Updated toy information
    app.put("/myToys/:id", async (req, res) => {
      const id = req.params.id;
      const toy = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedToy = {
        $set: {
          price: toy.price,
          quantity: toy.quantity,
          description: toy.description,
        },
      };
      const result = await carToysCollection.updateOne(
        filter,
        updatedToy,
        options
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Car Toy Zone server running");
});

app.listen(port, () => {
  console.log("Car toy zone server running port is", port);
});
