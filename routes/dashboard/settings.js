const express = require("express");
const { Payment, Marketing } = require("../../models");
const {
  codValidation,
  bkashValidation,
  marketingValidation,
} = require("../../validation/settings");
const { validation } = require("../../validation");
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
    await Payment.findOneAndUpdate(
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
    await Payment.findOneAndUpdate(
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
router.get("/marketing", async (req, res) => {
  try {
    const storeID = req.storeID;
    const item = await Marketing.findOne({ storeID });
    res.json({ item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.post("/marketing", marketingValidation, validation, async (req, res) => {
  try {
    const storeID = req.storeID;
    const { gtm, pixelID, pixelToken, pixelEventID } = req.body;
    await Marketing.findOneAndUpdate(
      { storeID },
      { gtm, pixelID, pixelToken, pixelEventID },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
