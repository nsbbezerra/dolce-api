const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const CashHandlingSchema = new Schema({
  cashier: {
    type: mongoose.Types.ObjectId,
    ref: "Cashier",
  },
  description: String,
  value: Number,
  typeHandling: {
    type: String,
    enum: ["revenue", "expense"],
  },
  employee: {
    type: mongoose.Types.ObjectId,
    ref: "Employee",
  },
});

const CashHandling = mongoose.model("CashHandling", CashHandlingSchema);

module.exports = CashHandling;
