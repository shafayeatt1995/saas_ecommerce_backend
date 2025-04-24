const express = require("express");
const { Delivery } = require("../../models");
const { validation } = require("../../validation");
const { paginate, objectID } = require("../../utils");
const { deliveryValidation } = require("../../validation/delivery");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const storeID = req.storeID;
    const { page, perPage } = req.query;

    const [items, total] = await Promise.all([
      Delivery.aggregate([
        { $match: { storeID: objectID(storeID) } },
        { $sort: { _id: -1 } },
        ...paginate(page, perPage),
      ]),
      Delivery.countDocuments({
        storeID,
      }),
    ]);
    res.json({ items, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.post("/", deliveryValidation, validation, async (req, res) => {
  try {
    const storeID = req.storeID;
    const { address, charge } = req.body;
    await Delivery.create({ address, charge, storeID });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.put("/", deliveryValidation, validation, async (req, res) => {
  try {
    const storeID = req.storeID;
    const { address, charge, _id } = req.body;
    const delivery = await Delivery.findOneAndUpdate(
      { _id, storeID },
      { address, charge }
    );
    res.json({ delivery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.delete("/", async (req, res) => {
  try {
    const storeID = req.storeID;
    const { _id } = req.query;
    await Delivery.findOneAndDelete({ _id, storeID });
    res.json({ success: true, message: "Delivery deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
