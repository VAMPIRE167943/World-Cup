var { MongoClient } = require("mongodb");
var { updateFront } = require("./Websocket");

async function connect()
{
  var client = await MongoClient.connect("mongodb://127.0.0.1:27017/mongooseBase", {
    useUnifiedTopology: true,
    monitorCommands: true,
  });
  return client.db("mongooseBase");
}

async function updateMatches()
{
  new Promise().then(function ()
  {
    updateFront();
  });
}
module.exports = { connect, updateMatches };
