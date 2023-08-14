var mongoose = require('mongoose');

var human = new mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  teams: Array
});

const person = mongoose.model('person', human);

module.exports = person;