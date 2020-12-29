const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const BankAccountSchema = new Schema({
  bank: String,
  value: Number,
  updated: Date,
});

const BankAccount = mongoose.model("BankAccount", BankAccountSchema);

module.exports = BankAccount;
