const express = require("express");
const router = express.Router();

router.use("/store", require("./store"));

module.exports = router;
