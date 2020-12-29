const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const ChartSchema = new Schema({
  client: {
    type: mongoose.Types.ObjectId,
    ref: "Clients",
  },
  products: [
    {
      id: String,
      thumbnail: String,
      name: String,
      colorId: String,
      colorHexDecimal: String,
      size: String,
      amount: Number,
      unitaryValue: Number,
      totalValue: Number,
    },
  ],
  status: {
    type: Boolean,
    required: true,
  },
  createDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const Chart = mongoose.model("Chart", ChartSchema);

module.exports = Chart;
