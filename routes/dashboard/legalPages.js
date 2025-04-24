const express = require("express");
const { Store } = require("../../models");
const { objectID } = require("../../utils");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const storeID = req.storeID;
    const { legalPages } = await Store.findOne({
      _id: objectID(storeID),
    }).select("legalPages");
    res.json({ legalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.post("/", async (req, res) => {
  try {
    const storeID = req.storeID;
    const { about, privacy, terms, returnPolicy } = req.body;
    await Store.findOneAndUpdate(
      { _id: storeID },
      { $set: { legalPages: { about, privacy, terms, returnPolicy } } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
