var mongoose = require("mongoose");

var human = new mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  teams: Array,
});

const Person = mongoose.model("Person", human);

module.exports = Person;
