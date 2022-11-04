const express = require('express');
const mongo = require('./services/mongo')
const app = express();
const port = 3000;

// [TODO] Fetch positions from mongodb collection
app.get('/get-positions', async (req, res) => {
  try {
    await mongo.client.db("admin").command({ ping: 1 });
    res.send('Hello World!');
  } catch(error) {
    console.error(`[app:get-positions] Error: ${error.message}`);
  }
})

// [TODO] Create position into mongodb collection
app.post('/create-position', async (req, res) => {
  try {
    await mongo.client.db("admin").command({ ping: 1 });
    res.send('Hello World!');
  } catch(error) {
    console.error(`[app:create-position] Error: ${error.message}`);
  }
})

app.listen(port, async () => {
  console.log(`listening on port ${port}`);
  await mongo.connect();
})

