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
