const mongoose = require("../../database/database");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const EmployeeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["fem", "masc"],
  },
  contact: String,
  admin: {
    type: Boolean,
    require: true,
  },
  sales: {
    type: Boolean,
    required: true,
  },
  caixa: {
    type: Boolean,
    required: true,
  },
  admission: {
    type: String,
  },
  comission: {
    type: Number,
  },
  comissioned: {
    type: Boolean,
    required: true,
  },
  user: {
    type: String,
  },
  password: {
    type: String,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
});

EmployeeSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
