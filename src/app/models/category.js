const mongoose = require("../../database/database");
const Schema = mongoose.Schema;
const configs = require("../../configs/configs");

const CategorySchema = new Schema(
  {
    department: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
    },
    name: String,
    thumbnail: String,
    description: String,
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

CategorySchema.virtual("thumbnail_url").get(function () {
  return `${configs.urlImage}/${this.thumbnail}`;
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
