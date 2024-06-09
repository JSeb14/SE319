var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());

const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const dbName = "SE319FINAL";
const client = new MongoClient(url);
const db = client.db(dbName);

const port = "8080";
const host = "localhost";

app.get("/shop", async (req, res) => {
  try {
    await client.connect();
    const query = {};
    const results = await db.collection("shop").find(query).toArray();
    console.log(results);
    res.status(200);
    res.send(results);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.get("/shop/:id", async (req, res) => {
  try {
    const product = Number(req.params.id);
    const query = { id: String(product) };
    await client.connect();

    // Check if the 'product' exists
    const check = await db.collection("shop").find(query).toArray();
    if (check.length == 0) {
      const msg = "Bad request: Item does not exist";
      console.log(msg);
      return res.status(409).send({ error: msg });
    }

    const results = await db.collection("shop").find(query).toArray();
    console.log(results);
    res.status(200);
    res.send(results);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/shop", async (req, res) => {
  try {
    await client.connect();

    // Check if body is non empty
    if (!req.body || Object.keys(req.body).length === 0) {
      const msg = "Bad request: No data provided.";
      console.log(msg);
      return res.status(400).send({ error: msg });
    }

    // Check if the 'product' exists
    const itemId = req.body.id;
    const query = { id: itemId };
    const results = await db.collection("shop").find(query).toArray();
    if (results.length > 0) {
      const msg = "Bad request: Item already exists";
      console.log(msg);
      return res.status(409).send({ error: msg });
    }

    const newDocument = {
      id: req.body.id,
      type: req.body.type,
      animal: req.body.animal,
      title: req.body.title,
      price: req.body.price,
      image: req.body.image,
      rate: {
        rating: req.body.rate.rating,
        count: req.body.rate.count,
      },
    };
    console.log(newDocument);

    const response = await db.collection("shop").insertOne(newDocument);
    res.status(200);
    res.send(response);
  } catch (error) {
    res.status(500).send({ error: "An internal server error occurred" });
  }
});

app.put("/shop/:id", async (req, res) => {
  try {
    const id = String(req.params.id);
    const query = { id: id };
    await client.connect();

    // Check if body is non empty
    if (!req.body || Object.keys(req.body).length === 0) {
      const msg = "Bad request: No data provided.";
      console.log(msg);
      return res.status(400).send({ error: msg });
    }

    // Check if the 'product' exists
    const check = await db.collection("shop").find(query).toArray();
    if (check.length == 0) {
      const msg = "Bad request: Item does not exist";
      console.log(msg);
      return res.status(409).send({ error: msg });
    }

    console.log(req.body);
    const updateData = {
      $set: {
        id: req.body.id,
        type: req.body.type,
        animal: req.body.animal,
        title: req.body.title,
        price: req.body.price,
        image: req.body.image,
        stock: req.body.stock,
        rate: {
          rating: req.body.rate.rating,
          count: req.body.rate.count,
        },
      },
    };

    const options = { upsert: true };
    const results = await db
      .collection("shop")
      .updateOne(query, updateData, options);
    res.status(200);
    res.send(results);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.delete("/shop/:id", async (req, res) => {
  try {
    const id = String(req.params.id);
    const query = { id: id };
    await client.connect();

    // Check if the 'product' exists
    const check = await db.collection("shop").find(query).toArray();
    if (check.length == 0) {
      const msg = "Bad request: Item does not exist";
      console.log(msg);
      return res.status(409).send({ error: msg });
    }

    const results = await db.collection("shop").deleteOne(query);
    res.status(200);
    res.send(results);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
//------------------------------------

app.get("/adopt", async (req, res) => {
  try {
    await client.connect();
    const query = {};
    const results = await db.collection("adopt").find(query).toArray();
    console.log(results);
    res.status(200);
    res.send(results);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.get("/adopt/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const query = { id: id };
    await client.connect();

    // Check if the 'product' exists
    const check = await db.collection("adopt").find(query).toArray();
    if (check.length == 0) {
      const msg = "Bad request: Item does not exist";
      console.log(msg);
      return res.status(409).send({ error: msg });
    }

    const results = await db.collection("adopt").find(query).toArray();
    console.log(results);
    res.status(200);
    res.send(results);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/adopt", async (req, res) => {
  try {
    await client.connect();

    // Check if body is non empty
    if (!req.body || Object.keys(req.body).length === 0) {
      const msg = "Bad request: No data provided.";
      console.log(msg);
      return res.status(400).send({ error: msg });
    }

    // Check if the 'product' exists
    const id = req.body.id;
    const query = { id: id };
    const results = await db.collection("adopt").find(query).toArray();
    if (results.length > 0) {
      const msg = "Bad request: Item already exists";
      console.log(msg);
      return res.status(409).send({ error: msg });
    }

    const newDocument = {
      id: req.body.id,
      animal: req.body.animal,
      name: req.body.name,
      age: req.body.age,
      description: req.body.description,
      image: req.body.image,
      isReserved: req.body.isReserved,
    };
    console.log(newDocument);

    const response = await db.collection("adopt").insertOne(newDocument);
    res.status(200);
    res.send(response);
  } catch (error) {
    res.status(500).send({ error: "An internal server error occurred" });
  }
});

app.put("/adopt/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { id: id };
    await client.connect();

    // Check if body is non empty
    if (!req.body || Object.keys(req.body).length === 0) {
      const msg = "Bad request: No data provided.";
      console.log(msg);
      return res.status(400).send({ error: msg });
    }

    // Check if the 'product' exists
    const check = await db.collection("adopt").find(query).toArray();
    if (check.length == 0) {
      const msg = "Bad request: Item does not exist";
      console.log(msg);
      return res.status(409).send({ error: msg });
    }

    console.log(req.body);
    const updateData = {
      $set: {
      id: req.body.id,
      animal: req.body.animal,
      name: req.body.name,
      age: req.body.age,
      description: req.body.description,
      image: req.body.image,
      isReserved: req.body.isReserved,
      },
    };

    const options = { upsert: true };
    const results = await db
      .collection("adopt")
      .updateOne(query, updateData, options);
    res.status(200);
    res.send(results);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.delete("/adopt/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { id: id };
    await client.connect();

    // Check if the 'product' exists
    const check = await db.collection("adopt").find(query).toArray();
    if (check.length == 0) {
      const msg = "Bad request: Item does not exist";
      console.log(msg);
      return res.status(409).send({ error: msg });
    }

    const results = await db.collection("adopt").deleteOne(query);
    res.status(200);
    res.send(results);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.get("/order", async (req, res) => {
  try {
    await client.connect();
    const query = {};
    const results = await db.collection("order").find(query).toArray();
    console.log(results);
    res.status(200);
    res.send(results);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/order", async (req, res) => {
  try {
    await client.connect();

    // Check if body is non empty
    if (!req.body || Object.keys(req.body).length === 0) {
      const msg = "Bad request: No data provided.";
      console.log(msg);
      return res.status(400).send({ error: msg });
    }

    const newDocument = {
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      card: req.body.card,
      items: req.body.items,
    };
    console.log(newDocument);

    const response = await db.collection("order").insertOne(newDocument);
    res.status(200);
    res.send(response);
  } catch (error) {
    res.status(500).send({ error: "An internal server error occurred" });
  }
});

app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});
