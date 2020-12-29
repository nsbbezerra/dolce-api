const mongoose = require("../../database/database");
const Schema = mongoose.Schema;
const configs = require("../../configs/configs");

const DepartmentSchema = new Schema(
  {
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

const Department = mongoose.model("Department", DepartmentSchema);

module.exports = Department;
