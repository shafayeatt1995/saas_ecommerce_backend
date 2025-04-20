const express = require("express");
const { Category } = require("../../models");
const { categoryValidation } = require("../../validation/category");
const { validation } = require("../../validation");
const { paginate, objectID } = require("../../utils");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const storeID = req.storeID;
    const { page, perPage } = req.query;

    const [items, total] = await Promise.all([
      Category.aggregate([
        { $match: { storeID: objectID(storeID) } },
        { $sort: { _id: -1 } },
        ...paginate(page, perPage),
      ]),
      Category.countDocuments({
        storeID,
      }),
    ]);
    res.json({ items, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.post("/", categoryValidation, validation, async (req, res) => {
  try {
    const storeID = req.storeID;
    const { image, name } = req.body;
    await Category.create({
      image,
      name,
      storeID,
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.put("/", categoryValidation, validation, async (req, res) => {
  try {
    const storeID = req.storeID;
    const { image, name, _id } = req.body;
    const category = await Category.updateOne(
      { _id, storeID },
      { image, name }
    );
    res.json({ category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.delete("/", async (req, res) => {
  try {
    const storeID = req.storeID;
    const { _id } = req.query;
    await Category.deleteOne({ _id, storeID });
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
