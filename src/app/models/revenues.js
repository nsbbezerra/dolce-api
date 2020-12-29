const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const RevenueSchema = new Schema({
  planContas: {
    type: mongoose.Types.ObjectId,
    ref: "PlanAccount",
    required: true,
  },
  payForm: {
    type: mongoose.Types.ObjectId,
    ref: "PayForm",
    required: true,
  },
  accountBank: {
    type: mongoose.Types.ObjectId,
    ref: "BankAccount",
    required: true,
  },
  name: String,
  vencimento: {
    type: Date,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  statusPay: {
    type: String,
    enum: ["cancel", "wait", "pay"],
    required: true,
  },
  statusRevenue: {
    type: String,
    enum: ["aguardando", "aprovado"],
    required: true,
  },
  createDate: {
    type: String,
    required: true,
  },
  dateSave: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  description: {
    type: String,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
});

const Revenues = mongoose.model("Revenue", RevenueSchema);

module.exports = Revenues;
