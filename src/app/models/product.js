const mongoose = require("../../database/database");
const Schema = mongoose.Schema;
const configs = require("../../configs/configs");

const ProductSchema = new Schema(
  {
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
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
      default: Date.now(),
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
    promotional: {
      type: Boolean,
      required: true,
      default: false,
    },
    promotionalValue: {
      type: Number,
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
    thumbnail: String,
    freight: {
      codService: [
        { code: { type: String, enum: ["04014", "04510", "40290"] } },
      ],
      weight: String,
      width: Number,
      height: Number,
      diameter: Number,
      length: Number,
      format: {
        type: Number,
        enum: [1, 2, 3],
      },
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

ProductSchema.virtual("thumbnail_url").get(function () {
  return `${configs.urlImage}/${this.thumbnail}`;
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
