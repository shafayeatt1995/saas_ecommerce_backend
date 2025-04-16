const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
  {
    userID: {
      type: String,
      required: true,
      validate: {
        validator: (v) => mongoose.Types.ObjectId.isValid(v) || v === "admin",
        message: (props) => `${props.value} is not a valid user ID!`,
      },
    },
    url: { type: String, unique: true, index: true, required: true },
    key: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { strict: true }
);

module.exports = mongoose.model("Image", ImageSchema);
