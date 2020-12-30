const mongoose = require("../../database/database");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  contact: String,
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
  restrict: {
    type: Boolean,
    default: false,
    required: true,
  },
  createDate: {
    type: String,
    require: true,
  },
  save: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  token: {
    type: String,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  premission: {
    type: String,
    required: true,
    default: "site",
    select: false,
  },
});

ClientSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

const Client = mongoose.model("Clients", ClientSchema);

module.exports = Client;
