const { check } = require("express-validator");

const validate = {
  categoryValidation: [
    check("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
    check("image").trim().isLength({ min: 1 }).withMessage("Image is required"),
  ],
};

module.exports = validate;
