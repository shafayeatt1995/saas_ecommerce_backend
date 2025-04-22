const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouponSchema = new Schema(
  {
    storeID: { type: mongoose.Types.ObjectId, ref: "Store", required: true },
    code: { type: String, required: true },
    type: { type: String, required: true, enum: ["amount", "percent"] },
    discountAmount: { type: Number, required: true, default: 0 },
    discountPercent: { type: Number, required: true, default: 0 },
    maxDiscount: { type: Boolean, required: true, default: false },
    maxDiscountAmount: { type: Number, required: true, default: 0 },
    minPurchase: { type: Boolean, required: true, default: false },
    minPurchaseAmount: { type: Number, required: true, default: 0 },
    expireDate: { type: Date, required: true },
    status: { type: Boolean, default: true },
  },
  {
    strict: true,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

module.exports = mongoose.model("Coupon", CouponSchema);
