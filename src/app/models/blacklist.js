const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const BlacklistSchema = new Schema({
  token: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

BlacklistSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Blacklist = mongoose.model("Blacklist", BlacklistSchema);

module.exports = Blacklist;
