const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const BalanceSheetSchema = new Schema({
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  receives: [
    {
      id: {
        type: String,
      },
      description: {
        type: String,
      },
      value: {
        type: Number,
      },
    },
  ],
  withdraw: [
    {
      id: {
        type: String,
      },
      description: {
        type: String,
      },
      value: {
        type: Number,
      },
    },
  ],
  previousBalance: {
    type: Number,
    required: true,
  },
  revenues: {
    type: Number,
    required: true,
  },
  expenses: {
    type: Number,
    required: true,
  },
  currentBalance: {
    type: Number,
    required: true,
  },
  closingDate: {
    type: String,
    required: true,
  },
  dateSave: {
    type: Date,
    default: Date.now(),
  },
});

const BalanceSheet = mongoose.model("BalanceSheet", BalanceSheetSchema);

module.exports = BalanceSheet;
