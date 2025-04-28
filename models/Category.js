const mongoose = require("mongoose");
const { AutoIncrement } = require("../config/mongo");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    storeID: { type: mongoose.Types.ObjectId, ref: "Store", required: true },
    id: { type: Number, unique: true, index: true },
    name: { type: String, required: true },
    image: { type: String, default: "/images/category/1.webp" },
  },
  {
    strict: true,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

CategorySchema.plugin(AutoIncrement, {
  id: "categoryCounter",
  inc_field: "id",
  inc_amount: 1,
});

module.exports = mongoose.model("Category", CategorySchema);
