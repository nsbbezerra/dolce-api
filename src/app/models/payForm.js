const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const PayFormSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  accountBank: {
    type: Schema.Types.ObjectId,
    ref: "BankAccount",
    required: true,
  },
  maxParcela: {
    type: Number,
    required: true,
  },
  intervalDays: {
    type: Number,
    required: true,
  },
  statusPay: {
    type: String,
    enum: ["vista", "parc"],
    required: true,
  },
  typePay: {
    type: String,
    enum: [
      "boleto",
      "credito",
      "debito",
      "duplicata",
      "transferencia",
      "dinheiro",
      "cheque",
    ],
    required: true,
  },
  siteShow: {
    type: Boolean,
    required: true,
  },
});

const PayForm = mongoose.model("PayForm", PayFormSchema);

module.exports = PayForm;
