#!/usr/bin/env node

const { MongoClient } = require("mongodb");

// Replace the following with values for your environment.
const username = encodeURIComponent("username");
const password = encodeURIComponent("password");
const clusterUrl = "127.0.0.1:27017";
const authMechanism = "DEFAULT";

const uri =
  `mongodb://${username}:${password}@${clusterUrl}/?authMechanism=${authMechanism}`;

const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    console.log("Connected successfully to server");
  } catch (error) {
    console.error(`[mongo:connect] Error: ${error.message}`);
  }
}

module.exports = {
  client,
  connect
}