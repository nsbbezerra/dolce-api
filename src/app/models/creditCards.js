const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const CreditCardSchema = new Schema({});

const CreditCard = mongoose.model("CreditCard", CreditCardSchema);

module.exports = CreditCard;
