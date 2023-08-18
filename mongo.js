var { MongoClient } = require("mongodb");

async function connect()
{
  var client = await MongoClient.connect("mongodb://127.0.0.1:27017/mongooseBase", {
    useUnifiedTopology: true,
    monitorCommands: true,
  });
  return client.db("mongooseBase");
}

module.exports = { connect };
