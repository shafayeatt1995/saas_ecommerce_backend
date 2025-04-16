const { check } = require("express-validator");

const validate = {
  productValidation: [
    check("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
    check("price")
      .trim()
      .isNumeric()
      .withMessage("Price is required")
      .custom((value) => value > 0)
      .withMessage("Price should be greater than 0"),
    check("dealingPrice")
      .trim()
      .isNumeric()
      .withMessage("Dealing price is required")
      .custom((value) => value > 0)
      .withMessage("Dealing price should be greater than 0"),
    check("commission")
      .trim()
      .isNumeric()
      .withMessage("Commission is required"),
    check("status").trim().isBoolean().withMessage("Status is required"),
    check("description")
      .trim()
      .optional()
      .isLength({ min: 1 })
      .withMessage("Description is required"),
    check("video")
      .trim()
      .optional()
      .isString()
      .withMessage("Video should be a string if provided"),
    check("categoryID")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Category is required"),
    check("subCategoryID")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Sub Category is required"),
    check("stock").trim().isBoolean().withMessage("Stock is required"),
    check("discountStatus")
      .trim()
      .isBoolean()
      .withMessage("Discount Status is required"),
    check("discount")
      .trim()
      .optional()
      .isNumeric()
      .withMessage("Discount is required"),
    check("images")
      .trim()
      .isArray({ min: 1 })
      .withMessage("Images should be selected at least one"),
  ],
};

module.exports = validate;
