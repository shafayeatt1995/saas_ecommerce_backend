const { check } = require("express-validator");

const validate = {
  subCategoryValidation: [
    check("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
    check("categoryID")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Select a Category"),
  ],
};

module.exports = validate;
