const mongoose = require("mongoose");
const { AutoIncrement } = require("../config/mongo");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    storeID: { type: mongoose.Types.ObjectId, ref: "Store", required: true },
    categoryIDs: {
      type: [mongoose.Types.ObjectId],
      ref: "Category",
      default: () => [],
    },
    subCategoryIDs: {
      type: [mongoose.Types.ObjectId],
      ref: "SubCategory",
      default: () => [],
    },
    id: { type: Number, unique: true },
    name: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, required: true },
    variation: {
      type: [
        {
          name: String,
          options: [
            { title: String, price: Number, discount: Number, stock: Boolean },
          ],
        },
      ],
      default: [],
    },
    video: { type: String, default: "" },
    stock: { type: Boolean, default: true },
    discountStatus: { type: Boolean, default: false },
    discountPrice: { type: Number, default: 0 },
    thumbnail: { type: String, required: true },
    gallery: { type: [String], default: [] },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
  },
  {
    strict: true,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

ProductSchema.plugin(AutoIncrement, {
  id: "productCounter",
  inc_field: "id",
  inc_amount: 1,
});

module.exports = mongoose.model("Product", ProductSchema);
