const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const ActivationSchema = new Schema({
  idCompany: String,
  activationCode: String,
  dueDate: {
    type: Date,
  },
  activationDate: {
    type: Date,
  },
  statusActivation: {
    type: String,
    enum: ["vanquished", "activated"],
  },
});

const Activation = mongoose.model("Activation", ActivationSchema);

module.exports = Activation;
