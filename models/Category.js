const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true },
    image: { type: String, default: "/images/category/1.webp" },
  },
  { strict: true }
);

module.exports = mongoose.model("Category", CategorySchema);
