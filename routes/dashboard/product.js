const express = require("express");
const { Category, Product, Store } = require("../../models");
const {
  parseError,
  stringSlug,
  paginate,
  hasOne,
  randomKey,
  objectID,
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
        ...hasOne("categoryID", "categories", "category", ["name"]),
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
    const { _id, type } = req.authUser;
    const { id } = req.query;
    const item = await Product.findOne({
      userID: type === "admin" ? "admin" : _id,
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
      categoryID,
      name,
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

    let slug = stringSlug(name);
    const findProduct = await Product.findOne({ slug });
    if (findProduct) slug = `${slug}-${randomKey()}`;

    await Product.create({
      storeID,
      categoryID: categoryID || null,
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
      categoryID,
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

    const findProduct = await Product.findOne({ slug, _id: { $ne: _id } });
    if (findProduct) slug = `${slug}-${randomKey()}`;

    await Product.updateOne({
      categoryID,
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

router.delete("/", async (req, res) => {
  try {
    const { _id, type } = req.authUser;
    const { _id: id } = req.query;
    await Product.deleteOne({
      userID: type === "admin" ? "admin" : _id,
      _id: id,
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error, parseError(error));
    return res.status(500).json(parseError(error));
  }
});

module.exports = router;
