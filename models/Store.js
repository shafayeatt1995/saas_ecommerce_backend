const mongoose = require("mongoose");
const { AutoIncrement } = require("../config/mongo");
const { addDate } = require("../utils");
const Payment = require("./Payment");
const Marketing = require("./Marketing");
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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (doc._wasNew) {
      await Payment.create({ storeID: doc._id }, { session });
      await Marketing.create({ storeID: doc._id }, { session });
    }
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    console.error("Error creating Payment for new store:", error);
    await session.abortTransaction();
    await session.endSession();
  }
});

StoreSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Payment.findOneAndDelete({ storeID: doc._id }, { session });
    await Marketing.findOneAndDelete({ storeID: doc._id }, { session });

    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    console.error("Error deleting associated Payment & Marketing:", err);
    await session.abortTransaction();
    await session.endSession();
  }
});

module.exports = mongoose.model("Store", StoreSchema);
