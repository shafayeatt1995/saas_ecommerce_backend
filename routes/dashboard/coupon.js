const express = require("express");
const { validation } = require("../../validation");
const { paginate, objectID, toggle, endDate } = require("../../utils");
const { Coupon } = require("../../models");
const { couponValidation } = require("../../validation/coupon");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const storeID = req.storeID;
    const { page, perPage } = req.query;

    const [items, total] = await Promise.all([
      Coupon.aggregate([
        { $match: { storeID: objectID(storeID) } },
        { $sort: { _id: -1 } },
        ...paginate(page, perPage),
      ]),
      Coupon.countDocuments({ storeID }),
    ]);
    res.json({ items, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.post("/", couponValidation, validation, async (req, res) => {
  try {
    const storeID = req.storeID;
    const {
      code,
      type,
      discountAmount,
      discountPercent,
      maxDiscount,
      maxDiscountAmount,
      minPurchase,
      minPurchaseAmount,
      expireDate,
    } = req.body;
    await Coupon.create({
      code,
      type,
      discountAmount,
      discountPercent,
      maxDiscount,
      maxDiscountAmount,
      minPurchase,
      minPurchaseAmount,
      expireDate: endDate(expireDate),
      storeID,
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.put("/", couponValidation, validation, async (req, res) => {
  try {
    const storeID = req.storeID;
    const {
      code,
      type,
      discountAmount,
      discountPercent,
      maxDiscount,
      maxDiscountAmount,
      minPurchase,
      minPurchaseAmount,
      expireDate,
      _id,
    } = req.body;
    await Coupon.findOneAndUpdate(
      { _id, storeID },
      {
        code,
        type,
        discountAmount,
        discountPercent,
        maxDiscount,
        maxDiscountAmount,
        minPurchase,
        minPurchaseAmount,
        expireDate: endDate(expireDate),
      }
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
    await Coupon.findOneAndDelete({ _id, storeID });
    res.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.post("/toggle-status", async (req, res) => {
  try {
    const storeID = req.storeID;
    const { _id } = req.body;
    await Coupon.findOneAndUpdate({ _id, storeID }, toggle("status"));
    res.json({ success: true, message: "Status toggled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
