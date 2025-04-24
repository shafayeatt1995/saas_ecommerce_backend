const express = require("express");
const { Store } = require("../../models");
const { validation } = require("../../validation");
const { storeUpdateValidation } = require("../../validation/store");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const storeID = req.storeID;
    const item = await Store.findOne({ _id: storeID });
    res.json({ item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.post("/", storeUpdateValidation, validation, async (req, res) => {
  try {
    const storeID = req.storeID;
    const {
      name,
      logo,
      type,
      email,
      phone,
      address,
      metaTitle,
      metaDescription,
    } = req.body;
    await Store.findOneAndUpdate(
      { storeID },
      { name, logo, type, email, phone, address, metaTitle, metaDescription },
      { new: true }
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
