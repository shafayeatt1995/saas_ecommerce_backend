const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
  {
    storeID: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    url: { type: String, unique: true, index: true, required: true },
    key: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { strict: true }
);

module.exports = mongoose.model("Image", ImageSchema);
