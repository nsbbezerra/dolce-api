const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const ColorSchema = new Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
  },
  name: String,
  hexDecimal: String,
});

const Color = mongoose.model("Color", ColorSchema);

module.exports = Color;
