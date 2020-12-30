const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const SizeSchema = new Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
  },
  id: String,
  color: {
    type: mongoose.Types.ObjectId,
    ref: "Color",
  },
  size: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const Size = mongoose.model("Size", SizeSchema);

module.exports = Size;
