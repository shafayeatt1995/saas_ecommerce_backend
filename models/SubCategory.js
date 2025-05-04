const mongoose = require("mongoose");
const { AutoIncrement } = require("../config/mongo");
const Schema = mongoose.Schema;

const SubCategorySchema = new Schema(
  {
    storeID: { type: mongoose.Types.ObjectId, ref: "Store", required: true },
    categoryID: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    id: { type: Number, unique: true, index: true },
    name: { type: String, required: true },
    image: { type: String, default: "/images/category/1.webp" },
  },
  {
    strict: true,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

SubCategorySchema.plugin(AutoIncrement, {
  id: "subCategoryCounter",
  inc_field: "id",
  inc_amount: 1,
});

module.exports = mongoose.model("SubCategory", SubCategorySchema);
