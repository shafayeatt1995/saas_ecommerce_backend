const mongoose = require("mongoose");
const { AutoIncrement } = require("../config/mongo");
const { addDate } = require("../utils");
const { Payment } = require(".");
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
    legalPages: {
      type: {
        about: String,
        privacy: String,
        terms: String,
        returnPolicy: String,
      },
      default: { about: "", privacy: "", terms: "", returnPolicy: "" },
      select: false,
    },
  },
  {
    strict: true,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

StoreSchema.post("save", async function (doc) {
  try {
    if (doc.isNew) await Payment.create({ storeID: doc._id });
  } catch (error) {
    console.error(error);
  }
});

StoreSchema.plugin(AutoIncrement, {
  id: "storeCounter",
  inc_field: "sn",
  inc_amount: 2,
});

module.exports = mongoose.model("Store", StoreSchema);
