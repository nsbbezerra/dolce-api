const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const CreditCardSchema = new Schema({
  client: {
    type: mongoose.Types.ObjectId,
    ref: "Clients",
  },
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
});

const CreditCard = mongoose.model("CreditCard", CreditCardSchema);

module.exports = CreditCard;
