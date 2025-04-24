const mongoose = require("mongoose");
const { AutoIncrement } = require("../config/mongo");
const { addDate } = require("../utils");
const Payment = require("./Payment");
const Schema = mongoose.Schema;

const StoreSchema = new Schema(
  {
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id: { type: Number, unique: true, index: true },
    name: { type: String, required: true },
    logo: { type: String, default: "/images/store/default.webp" },
    type: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
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

StoreSchema.plugin(AutoIncrement, {
  id: "storeCounter",
  inc_field: "id",
  inc_amount: 2,
});

StoreSchema.pre("save", function (next) {
  this._wasNew = this.isNew;
  next();
});

StoreSchema.post("save", async function (doc) {
  try {
    if (doc._wasNew) {
      await Payment.create({ storeID: doc._id });
    }
  } catch (error) {
    console.error("Error creating Payment for new store:", error);
  }
});

module.exports = mongoose.model("Store", StoreSchema);
