const { check } = require("express-validator");

const validate = {
  productValidation: [
    check("categoryID")
      .trim()
      .optional()
      .isString()
      .withMessage("Category is required"),
    check("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
    check("price")
      .trim()
      .isNumeric()
      .withMessage("Price is required")
      .custom((value) => value > 0)
      .withMessage("Price should be greater than 0"),
    check("status").trim().isBoolean().withMessage("Status is required"),
    check("shortDescription")
      .trim()
      .optional()
      .isString()
      .withMessage("Short description is required"),
    check("description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Description is required"),
    check("video")
      .trim()
      .optional()
      .isString()
      .withMessage("Video should be embed url"),
    check("stock").trim().isBoolean().withMessage("Stock is required"),
    check("discountStatus")
      .trim()
      .isBoolean()
      .withMessage("Discount Status is required"),
    check("discountPrice")
      .trim()
      .optional()
      .isNumeric()
      .withMessage("Discount Price is required"),
    check("thumbnail")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Thumbnail is required"),
    check("gallery")
      .trim()
      .optional()
      .isArray()
      .withMessage("Gallery should be multiple selected images"),
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
