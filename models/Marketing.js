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
    analytics: { type: String, default: "" },
    pixelID: { type: String, default: "" },
    pixelToken: { type: String, default: "" },
    pixelEventID: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      youtube: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      discord: { type: String, default: "" },
      telegram: { type: String, default: "" },
      daraz: { type: String, default: "" },
      amazon: { type: String, default: "" },
      walmart: { type: String, default: "" },
      snapchat: { type: String, default: "" },
    },
  },
  {
    strict: true,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

module.exports = mongoose.model("Marketing", MarketingSchema);
