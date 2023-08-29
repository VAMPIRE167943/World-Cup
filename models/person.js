var mongoose = require("mongoose");
var { Schema } = mongoose;

var human = new Schema({
  name: { type: String, required: true, lowercase: true },
  surname: { type: String, required: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  teams: Array,
  leagues: Array
});

const Person = mongoose.model("Person", human);

module.exports = Person;
