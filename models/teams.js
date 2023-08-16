var mongoose = require("mongoose");
var { Schema } = mongoose;

var team = new Schema({
  team_name: { type: String, lowercase: true },
  team_id: { type: Number, unique: true },
  country_name: { type: String, lowercase: true },
  country_code: { type: String, uppercase: true },
  tier: {type: Number}
});

const Team = mongoose.model("Team", team);

module.exports = Team;
