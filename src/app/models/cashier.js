const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const CashierSchema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  valueOpened: {
    type: Number,
    required: true,
  },
  valueClosed: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  movimentDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "close"],
    require: true,
    default: "open",
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

const Cashier = mongoose.model("Cashier", CashierSchema);

module.exports = Cashier;
