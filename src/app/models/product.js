const mongoose = require("../../database/database");
const Schema = mongoose.Schema;
const configs = require("../../configs/configs");

const ProductSchema = new Schema({
  name: String,
  description: String,
  sku: String,
  rating: Number,
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  save: {
    type: Date,
    required: true,
    default: new Date(),
  },
  atualizedDate: {
    type: Date,
  },
  atualized: {
    type: Boolean,
  },
  disponible: {
    type: Boolean,
    required: true,
    default: true,
  },
  cfop: {
    type: String,
  },
  ncm: {
    type: String,
  },
  icms: {
    rate: Number,
    origin: String,
    csosn: String,
    icmsSTRate: Number,
    icmsMargemValorAddST: Number,
    icmsSTModBC: String,
    fcpRate: Number,
    fcpSTRate: Number,
    fcpRetRate: Number,
    ipiCst: String,
    ipiRate: Number,
    ipiCode: String,
  },
  pis: {
    rate: Number,
    cst: String,
  },
  cofins: {
    rate: Number,
    cst: String,
  },
  cest: {
    type: String,
  },
  costValue: {
    type: Number,
    required: true,
  },
  saleValue: {
    type: Number,
    required: true,
  },
  margeLucro: Number,
  typeCalculate: {
    type: String,
    enum: ["markup", "margemBruta"],
  },
  markupFactor: {
    factor: Number,
    margeLucro: Number,
    comission: Number,
    otherExpenses: Number,
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
