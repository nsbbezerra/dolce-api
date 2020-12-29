const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const CheckSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "Clients",
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  entity: {
    type: String,
    required: true,
  },
  situation: {
    type: String,
    enum: ["wait", "approved", "refused"],
    required: true,
  },
  type: {
    type: String,
    enum: ["vista", "prazo"],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  emitDate: {
    type: String,
    required: true,
  },
  vencimento: {
    type: Date,
    required: true,
  },
  obs: {
    type: String,
    required: true,
  },
});

const Check = mongoose.model("Check", CheckSchema);

module.exports = Check;
