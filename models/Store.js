const mongoose = require("mongoose");
const { AutoIncrement } = require("../config/mongo");
const { addDate } = require("../utils");
const Schema = mongoose.Schema;

const StoreSchema = new Schema(
  {
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sn: { type: Number, unique: true, index: true },
    name: { type: String, required: true },
    logo: { type: String, default: "/images/store/default.webp" },
    type: { type: String, required: true },
    address: { type: String },
    meta: { type: { title: String, description: String } },
    expiredAt: { type: Date, default: addDate(-1) },
  },
  {
    strict: true,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

StoreSchema.plugin(AutoIncrement, {
  id: "storeCounter",
  inc_field: "sn",
  inc_amount: 2,
});

module.exports = mongoose.model("Store", StoreSchema);
