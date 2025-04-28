const express = require("express");
const { Store, Marketing, Product, Category } = require("../models");
const { objectID, paginate, hasMany } = require("../utils");
const router = express.Router();

router.get("/fetch", async (req, res) => {
  try {
    const { id } = req.query;
    const store = await Store.findOne({
      id,
      expiredAt: { $gte: new Date() },
    }).select({
      expiredAt: 0,
      userID: 0,
      type: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    const marketing = await Marketing.findOne({ storeID: store._id });
    res.json({ store, marketing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/fetch-home", async (req, res) => {
  try {
    const { storeID, page, perPage } = req.query;
    const items = await Category.aggregate([
      { $match: { storeID: objectID(storeID) } },
      ...paginate(page, perPage),
      ...hasMany(
        "products",
        "_id",
        "categoryID",
        "products",
        [
          "name",
          "slug",
          "price",
          "discountStatus",
          "discountPrice",
          "thumbnail",
        ],
        { status: true }
      ),
    ]);

    // const products = await Product.find({ storeID });
    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
