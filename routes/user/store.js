const express = require("express");
const { Store } = require("../../models");
const { compareDate } = require("../../utils");
const { storeValidation } = require("../../validation/store");
const { validation } = require("../../validation");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { _id: userID } = req.authUser;
    const findItems = await Store.find({ userID });
    const items = findItems.map((item) => ({
      ...item._doc,
      isExpired: compareDate(item.expiredAt),
    }));
    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.post("/", storeValidation, validation, async (req, res) => {
  try {
    const { _id: userID } = req.authUser;
    const { name, type } = req.body;
    const store = await Store.create({
      userID,
      name,
      type,
    });
    res.json(store);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
