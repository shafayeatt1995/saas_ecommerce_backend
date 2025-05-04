const express = require("express");
const { SubCategory, Category } = require("../../models");
const { subCategoryValidation } = require("../../validation/subCategory");
const { validation } = require("../../validation");
const { paginate, objectID, hasOne } = require("../../utils");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const storeID = req.storeID;
    const { page, perPage } = req.query;

    const [items, total] = await Promise.all([
      SubCategory.aggregate([
        { $match: { storeID: objectID(storeID) } },
        { $sort: { _id: -1 } },
        ...paginate(page, perPage),
        ...hasOne("categoryID", "categories", "category", ["name"]),
      ]),
      SubCategory.countDocuments({
        storeID,
      }),
    ]);
    res.json({ items, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/categories", async (req, res) => {
  try {
    const storeID = req.storeID;
    const items = await Category.find({ storeID }).sort({ name: 1 });
    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.post("/", subCategoryValidation, validation, async (req, res) => {
  try {
    const storeID = req.storeID;
    const { image, name, categoryID } = req.body;
    await SubCategory.create({
      image,
      name,
      storeID,
      categoryID,
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.put("/", subCategoryValidation, validation, async (req, res) => {
  try {
    const storeID = req.storeID;
    const { image, name, _id, categoryID } = req.body;
    await SubCategory.findOneAndUpdate(
      { _id, storeID },
      { image, name, categoryID }
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.delete("/", async (req, res) => {
  try {
    const storeID = req.storeID;
    const { _id } = req.query;
    await SubCategory.findOneAndDelete({ _id, storeID });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
