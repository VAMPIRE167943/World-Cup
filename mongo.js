const { MongoClient } = require("mongodb");
const { updateFront } = require("./Websocket");

async function connect() {
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017", {
    useUnifiedTopology: true,
    monitorCommands: true,
  });
  return client.db("mongooseBase");
}

async function updateMatches() {
   new Promise()
   .then(function () {
      updateFront()
   })
}
module.exports = { connect, updateMatches };
