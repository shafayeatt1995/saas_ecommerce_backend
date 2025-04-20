const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isStore");
const isStore = require("../middleware/isStore");
const router = express.Router();

router.use("/auth", require("./auth"));

router.use(isAuthenticated);
router.use("/user", require("./user"));

router.use(isStore);
router.use("/dashboard", require("./dashboard"));

module.exports = router;
