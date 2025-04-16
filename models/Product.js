const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    userID: {
      type: String,
      required: true,
      validate: {
        validator: (v) => mongoose.Types.ObjectId.isValid(v) || v === "admin",
        message: (props) => `${props.value} is not a valid user ID!`,
      },
    },
    categoryID: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryID: {
      type: mongoose.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    name: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true, required: true },
    price: { type: Number, required: true },
    dealingPrice: { type: Number, required: true },
    commission: { type: Number, required: true },
    status: { type: Boolean, default: true },
    description: { type: String, required: true },
    variation: {
      type: [
        {
          name: String,
          options: [{ title: String, price: Number, stock: Boolean }],
        },
      ],
      default: [],
    },
    video: { type: String, default: "" },
    stock: { type: Boolean, default: true },
    discountStatus: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
    images: { type: [String], required: true },
  },
  { strict: true }
);

module.exports = mongoose.model("Product", ProductSchema);
