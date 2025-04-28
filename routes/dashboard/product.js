const express = require("express");
const { Category, Product, Store } = require("../../models");
const {
  parseError,
  stringSlug,
  paginate,
  hasOne,
  randomKey,
  objectID,
  hasMany,
} = require("../../utils");
const { productValidation } = require("../../validation/product");
const { validation } = require("../../validation");
const router = express.Router();

router.get("/category", async (req, res) => {
  try {
    const storeID = req.storeID;
    const items = await Category.find({ storeID });
    res.json({ items });
  } catch (error) {
    console.error(error, parseError(error));
    return res.status(500).json(parseError(error));
  }
});
router.get("/", async (req, res) => {
  try {
    const storeID = req.storeID;
    const { page, perPage } = req.query;
    const [items, total] = await Promise.all([
      Product.aggregate([
        { $match: { storeID: objectID(storeID) } },
        ...paginate(page, perPage),
      ]),
      Product.countDocuments({ storeID: objectID(storeID) }),
    ]);
    res.json({ items, total });
  } catch (error) {
    console.error(error, parseError(error));
    return res.status(500).json(parseError(error));
  }
});
router.get("/single-product", async (req, res) => {
  try {
    const storeID = req.storeID;
    const { id } = req.query;
    const item = await Product.findOne({
      storeID,
      _id: id,
    });
    res.json({ item });
  } catch (error) {
    console.error(error, parseError(error));
    return res.status(500).json(parseError(error));
  }
});
router.post("/", productValidation, validation, async (req, res) => {
  try {
    const { _id: userID } = req.authUser;
    const storeID = req.storeID;

    const {
      categoryIDs,
      name,
      slug,
      price,
      status,
      shortDescription,
      description,
      variation,
      video,
      stock,
      discountStatus,
      discountPrice,
      thumbnail,
      gallery,
      metaTitle,
      metaDescription,
    } = req.body;

    const validStore = await Store.findOne({ _id: storeID, userID });
    if (!validStore) {
      return res.status(404).json({ error: "You are not authorized" });
    }

    await Product.create({
      storeID,
      categoryIDs,
      name,
      slug,
      price,
      status,
      shortDescription,
      description,
      variation,
      video,
      stock,
      discountStatus,
      discountPrice,
      thumbnail,
      gallery,
      metaTitle,
      metaDescription,
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error, parseError(error));
    return res.status(500).json(parseError(error));
  }
});
router.put("/", productValidation, validation, async (req, res) => {
  try {
    const { _id: userID } = req.authUser;
    const storeID = req.storeID;

    let {
      _id,
      categoryIDs,
      name,
      slug,
      price,
      status,
      shortDescription,
      description,
      variation,
      video,
      stock,
      discountStatus,
      discountPrice,
      thumbnail,
      gallery,
      metaTitle,
      metaDescription,
    } = req.body;

    const validStore = await Store.findOne({ _id: storeID, userID });
    if (!validStore) {
      return res.status(404).json({ error: "You are not authorized" });
    }

    await Product.findOneAndUpdate(
      { _id },
      {
        categoryIDs,
        name,
        slug,
        price,
        status,
        shortDescription,
        description,
        variation,
        video,
        stock,
        discountStatus,
        discountPrice,
        thumbnail,
        gallery,
        metaTitle,
        metaDescription,
      }
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error, parseError(error));
    return res.status(500).json(parseError(error));
  }
});

router.delete("/", async (req, res) => {
  try {
    const storeID = req.storeID;
    const { id: _id } = req.query;
    await Product.findOneAndDelete({
      _id,
      storeID,
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error, parseError(error));
    return res.status(500).json(parseError(error));
  }
});

module.exports = router;
