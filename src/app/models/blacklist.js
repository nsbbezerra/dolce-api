const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const BlacklistSchema = new Schema({
  token: {
    type: String,
  },
  createdAt: {
    type: Date,
    expires: 86400,
    default: Date.now(),
    required: true,
  },
});

const Blacklist = mongoose.model("Blacklist", BlacklistSchema);

module.exports = Blacklist;
