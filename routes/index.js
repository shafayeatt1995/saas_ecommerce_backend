const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();

router.use("/auth", require("./auth"));
// router.use("/product", require("./product"));

// router.use(isAuthenticated);
// router.use("/user", require("./user"));
// router.use("/dashboard", require("./dashboard"));

// router.use(isAdmin);
// router.use("/admin", require("./admin"));

module.exports = router;
