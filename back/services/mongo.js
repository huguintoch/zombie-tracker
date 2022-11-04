const { MongoClient } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017/"

const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    console.log("Connected successfully to server");
  } catch(error) {
    console.error(`[mongo:connect] Error: ${error.message}`);
  }
}

module.exports = {
  client,
  connect
}