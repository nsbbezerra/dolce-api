const mongoose = require("../../database/database");
const Schema = mongoose.Schema;

const PlanAccountSchema = new Schema({
  planAccount: {
    type: String,
    required: true,
  },
  typeMoviment: {
    type: String,
    enum: ["debit", "credit"],
    required: true,
  },
});

const PlanAccount = mongoose.model("PlanAccount", PlanAccountSchema);

module.exports = PlanAccount;
