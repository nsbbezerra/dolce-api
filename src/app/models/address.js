const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "Clients",
    required: true,
    unique: true,
  },
  street: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  comp: {
    type: String,
  },
  bairro: {
    type: String,
    required: true,
  },
  cep: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  default: {
    type: Boolean,
  },
});

const addressSchema = mongoose.model("Address", AddressSchema);

module.exports = addressSchema;
