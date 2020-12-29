const mongoose = require("../../database/database");
const Schema = mongoose.Schema;
const configs = require("../../configs/configs");

const ImageColorSchema = new Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    color: {
      type: mongoose.Types.ObjectId,
      ref: "Color",
    },
    image: String,
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

ImageColorSchema.virtual("image_url").get(function () {
  return `${configs.urlImage}/${this.image}`;
});

const ImageColors = mongoose.model("ImageColors", ImageColorSchema);

module.exports = ImageColors;
