const { check } = require("express-validator");

const validate = {
  storeValidation: [
    check("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
    check("type").trim().isLength({ min: 1 }).withMessage("Type is required"),
  ],
  storeUpdateValidation: [
    check("id")
      .trim()
      .isNumeric()
      .isLength({ min: 1 })
      .withMessage("ID is required"),
    check("name")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Name is required"),
    check("logo")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Logo is required"),
    check("type")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Type is required"),
    check("email")
      .trim()
      .optional()
      .isString()
      .withMessage("Email is required"),
    check("phone")
      .trim()
      .optional()
      .isString()
      .withMessage("Phone is required"),
    check("address")
      .trim()
      .optional()
      .isString()
      .withMessage("Address is required"),
    check("metaTitle")
      .trim()
      .optional()
      .isString()
      .withMessage("Meta title is required"),
    check("metaDescription")
      .trim()
      .optional()
      .isString()
      .withMessage("Meta description is required"),
  ],
};

module.exports = validate;
