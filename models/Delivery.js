const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeliverySchema = new Schema(
  {
    storeID: { type: mongoose.Types.ObjectId, ref: "Store", required: true },
    address: { type: String, required: true },
    charge: { type: Number, required: true },
  },
  {
    strict: true,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

module.exports = mongoose.model("Delivery", DeliverySchema);
