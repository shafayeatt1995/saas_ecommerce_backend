const mongoose = require("mongoose");
const { AutoIncrement } = require("../config/mongo");
const Schema = mongoose.Schema;

const StoreSchema = new Schema(
  {
    sn: { type: Number, unique: true },
    name: { type: String, required: true },
    map: { type: String, default: "" },
    image: { type: String, default: "/images/store/1.webp" },
  },
  {
    strict: true,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

StoreSchema.plugin(AutoIncrement, { inc_field: "sn", inc_amount: 2 });

module.exports = mongoose.model("Store", StoreSchema);
