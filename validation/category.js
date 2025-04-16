const { check } = require("express-validator");

const validate = {
  categoryValidation: [
    check("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
  ],
};

module.exports = validate;
