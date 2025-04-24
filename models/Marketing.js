const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MarketingSchema = new Schema(
  {
    storeID: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      unique: true,
    },
    gtm: { type: String, default: "" },
    pixelID: { type: String, default: "" },
    pixelToken: { type: String, default: "" },
    pixelEventID: { type: String, default: "" },
  },
  {
    strict: true,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

module.exports = mongoose.model("Marketing", MarketingSchema);
