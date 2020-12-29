const mongoose = require("../../database/database");
const Schema = mongoose.Schema;
const configs = require("../../configs/configs");

const OrderSchema = new Schema(
  {
    client: {
      type: mongoose.Types.ObjectId,
      ref: "Clients",
    },
    employee: {
      name: String,
      id: String,
    },
    from: {
      type: String,
      enum: ["shop", "site"],
      required: true,
    },
    payment: {
      name: String,
      payId: String,
      plots: Number,
      plotsValue: Number,
      valueTotal: Number,
      paymentStatus: {
        type: String,
        enum: ["wait", "processing", "approved", "refused", "cancel"],
      },
    },
    products: [
      {
        id: String,
        name: String,
        colorId: String,
        colorHexDecimal: String,
        size: String,
        amount: Number,
        unitaryValue: Number,
        totalValue: Number,
      },
    ],
    addressId: {
      type: mongoose.Types.ObjectId,
      ref: "Address",
    },
    statusOrderSite: {
      type: String,
      enum: [
        "awaitingPayment",
        "preSale",
        "paymentConfirmed",
        "inSeparation",
        "unavailability",
        "packed",
        "sent",
      ],
    },
    statusOrderShop: {
      type: String,
      enum: ["budget", "revenues", "finalized"],
    },
    amount: Number,
    discount: Number,
    amountTotal: Number,
    dateToProcess: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    orderFile: String,
  },
  {
    toJSON: { virtuals: true },
  }
);

OrderSchema.virtual("order_file").get(function () {
  return `${configs.docsImage}/${this.orderFile}`;
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
