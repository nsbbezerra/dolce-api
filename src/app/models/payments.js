const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
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
  order: {
    type: mongoose.Types.ObjectId,
    ref: "Order",
  },
  plots: Number,
  plotsValue: Number,
  valueTotal: Number,
  statusPay: {
    type: String,
    enum: ["wait", "processing", "approved", "refused", "cancel"],
  },
});

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
