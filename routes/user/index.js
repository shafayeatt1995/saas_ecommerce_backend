const express = require("express");
const router = express.Router();

router.use("/store", require("./store"));
router.use("/image", require("./image"));

module.exports = router;
