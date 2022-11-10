#!/usr/bin/env node

const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('./services/mongo')

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Fetch sightings from mongodb collection
app.get('/get-positions', async (req, res) => {
  try {
    const cursor = mongo.client.db("zombie_tracker").collection("sighting").find();
    let results = []
    await cursor.forEach(hit => results.push(hit));
    res.json(results).status(200);
  } catch(error) {
    console.error(`[app:get-positions] Error: ${error.message}`);
  }
})

// Create sighting into mongodb collection
app.post('/create-position', async (req, res) => {
  try {
    const document = req.body;
    const result = await mongo.client.db("zombie_tracker").collection("sighting").insertOne(document);
    res.json({_id: result.insertedId, ...document}).status(200);
  } catch(error) {
    console.error(`[app:create-position] Error: ${error.message}`);
  }
})

app.listen(port, async () => {
  console.log(`listening on port ${port}`);
  await mongo.connect();
})

