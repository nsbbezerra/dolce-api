const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const BankAccountSchema = new Schema({
  bank: String,
  value: Number,
  updated: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const BankAccount = mongoose.model("BankAccount", BankAccountSchema);

module.exports = BankAccount;
