const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const ValidatorSchema = new Schema({
  initiate: {
    type: Boolean,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const Validator = mongoose.model("Validator", ValidatorSchema);

module.exports = Validator;
