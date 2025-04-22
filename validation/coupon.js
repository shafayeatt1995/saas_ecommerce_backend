const { check } = require("express-validator");

const validate = {
  couponValidation: [
    check("code").trim().isLength({ min: 1 }).withMessage("Code is required"),
    check("type").trim().isLength({ min: 1 }).withMessage("Type is required"),
    check("discountAmount")
      .trim()
      .isNumeric()
      .withMessage("Discount amount should be a valid number")
      .custom((value, { req }) => {
        if (req.body.type === "amount") {
          return Number(value) >= 0;
        }
        return true;
      })
      .withMessage("Discount amount should not be a negative number"),
    check("discountPercent")
      .trim()
      .isNumeric()
      .withMessage("Discount percent should be a valid number")
      .custom((value, { req }) => {
        if (req.body.type === "percent") {
          const val = Number(value);
          return val >= 0 && val <= 100;
        }
        return true;
      })
      .withMessage("Discount percent should be between 0 and 100"),
    check("maxDiscount")
      .trim()
      .isBoolean()
      .withMessage("Max discount is required"),
    check("maxDiscountAmount")
      .trim()
      .isNumeric()
      .withMessage("Max discount amount should be a valid number")
      .custom((value, { req }) => {
        if (req.body.maxDiscount) {
          const val = Number(value);
          return val >= 0;
        }
        return true;
      })
      .withMessage("Max discount amount should not be a negative number"),
    check("minPurchase")
      .trim()
      .isBoolean()
      .withMessage("Min purchase is required"),
    check("minPurchaseAmount")
      .trim()
      .optional()
      .isNumeric()
      .custom((value, { req }) => {
        if (req.body.minPurchase) {
          const val = Number(value);
          return val >= 0;
        }
        return true;
      })
      .withMessage("Min purchase amount should not be a negative number"),
    check("expireDate")
      .trim()
      .custom((value) => {
        return !isNaN(new Date(value).getTime());
      })
      .withMessage("Expire date should be a valid date"),
  ],
};

module.exports = validate;
