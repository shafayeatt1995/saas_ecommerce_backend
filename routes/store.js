const express = require("express");
const { Store, Marketing, Product, Category } = require("../models");
const { objectID, paginate } = require("../utils");
const { productCardPreset, categoryPreset } = require("../utils/preset");
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
    const { storeID } = req.query;
    const items = await Category.aggregate([
      { $match: { storeID: objectID(storeID) } },
      { $sort: { id: 1 } },
    ]);

    const products = await Promise.all(
      items.map(
        async ({ _id }) =>
          await Product.aggregate([
            {
              $match: {
                storeID: objectID(storeID),
                categoryIDs: { $in: [_id] },
                status: true,
              },
            },
            { $sort: { _id: -1 } },
            { $limit: 4 },
            { $project: productCardPreset },
          ])
      )
    );
    res.json({ items, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/fetch-product", async (req, res) => {
  try {
    const { storeID, productSlug } = req.query;
    const product = await Product.findOne({
      storeID,
      slug: productSlug,
      status: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    const relatedProducts = await Product.aggregate([
      {
        $match: {
          _id: { $ne: objectID(product._id) },
          storeID: objectID(storeID),
          categoryIDs: { $in: product.categoryIDs.map((id) => objectID(id)) },
          status: true,
        },
      },
      { $sample: { size: 4 } },
      { $project: productCardPreset },
    ]);

    res.json({ product, relatedProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/fetch-category-page", async (req, res) => {
  try {
    const { storeID } = req.query;

    const categories = await Category.aggregate([
      { $match: { storeID: objectID(storeID) } },
      { $sort: { id: 1 } },
      { $project: categoryPreset },
    ]);
    res.json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.post("/fetch-category-product", async (req, res) => {
  try {
    const { storeID, categoryID, page = 1, perPage = 24 } = req.body;
    const matchQuery = { storeID: objectID(storeID), status: true };
    if (categoryID) {
      const findCategory = await Category.findOne({
        storeID: objectID(storeID),
        id: categoryID,
      });
      matchQuery.categoryIDs = { $in: [objectID(findCategory._id)] };
    }
    const [products, total] = await Promise.all([
      Product.aggregate([
        { $match: matchQuery },
        { $sort: { _id: -1 } },
        ...paginate(page, perPage),
        { $project: productCardPreset },
      ]),
      Product.countDocuments(matchQuery),
    ]);

    res.json({ products, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
