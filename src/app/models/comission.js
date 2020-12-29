const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const ComissionSchema = new Schema({
  funcionario: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

const Comission = mongoose.model("Comission", ComissionSchema);

module.exports = Comission;
