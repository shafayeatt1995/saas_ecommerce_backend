const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
  {
    storeID: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      unique: true,
    },
    cod: {
      status: { type: Boolean, default: true },
      message: { type: String, default: "" },
    },
    bkash: {
      appKey: { type: String, default: "" },
      secretKey: { type: String, default: "" },
      username: { type: String, default: "" },
      password: { type: String, default: "" },
      message: { type: String, default: "" },
      type: { type: String, default: "fixed" },
      value: { type: Number, default: 0 },
      status: { type: Boolean, default: false },
    },
  },
  {
    strict: true,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

module.exports = mongoose.model("Payment", PaymentSchema);
