const express = require("express");
const router = express.Router();

router.use("/category", require("./category"));
router.use("/sub-category", require("./subCategory"));
router.use("/product", require("./product"));
router.use("/delivery", require("./delivery"));
router.use("/legal-pages", require("./legalPages"));
router.use("/coupon", require("./coupon"));
router.use("/settings", require("./settings"));
router.use("/store", require("./store"));

module.exports = router;
