const express = require("express");
const { Store, Payment } = require("../../models");
const { codValidation, bkashValidation } = require("../../validation/settings");
const { validation } = require("../../validation");
const { toggle } = require("../../utils");
const router = express.Router();

router.get("/payment", async (req, res) => {
  try {
    const storeID = req.storeID;
    const item = await Payment.findOne({ storeID });
    res.json({ item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.post("/cod", codValidation, validation, async (req, res) => {
  try {
    const storeID = req.storeID;
    const { message, status } = req.body;
    await Payment.updateOne(
      { storeID },
      { $set: { cod: { message, status } } },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.post("/bkash", bkashValidation, validation, async (req, res) => {
  try {
    const storeID = req.storeID;
    const {
      appKey,
      secretKey,
      username,
      password,
      message,
      type,
      value,
      status,
    } = req.body;
    await Payment.updateOne(
      { storeID },
      {
        $set: {
          bkash: {
            appKey,
            secretKey,
            username,
            password,
            message,
            type,
            value,
            status,
          },
        },
      },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
