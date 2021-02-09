const mongoose = require("../../database/database");
const Schema = mongoose.Schema;
const configs = require("../../configs/configs");

const PaymentSchema = new Schema(
  {
    planContas: {
      type: mongoose.Types.ObjectId,
      ref: "PlanAccount",
      required: true,
    },
    client: {
      type: mongoose.Types.ObjectId,
      ref: "Clients",
      required: true,
    },
    payForm: {
      type: mongoose.Types.ObjectId,
      ref: "PayForm",
      required: true,
    },
    name: String,
    accountBank: {
      type: mongoose.Types.ObjectId,
      ref: "BankAccount",
      required: true,
    },
    cashier: {
      type: String,
    },
    order: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
    },
    plots: Number,
    plotsValue: Number,
    valueTotal: Number,
    interestTax: Number,
    interestValue: Number,
    interestInterval: {
      type: String,
      enum: ["day", "month", "year"],
    },
    statusPay: {
      type: String,
      enum: ["wait", "processing", "approved", "refused", "cancel"],
    },
    creditCard: {
      number: {
        type: String,
        required: true,
      },
      month: {
        type: String,
        required: true,
      },
      year: {
        type: String,
        required: true,
      },
      flag: {
        type: String,
        required: true,
      },
    },
    boletoUrl: String,
    receipt: String,
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

PaymentSchema.virtual("receipt_url").get(function () {
  return `${configs.receiptImage}/${this.receipt}`;
});

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
