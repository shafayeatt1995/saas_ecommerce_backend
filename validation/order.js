const { check } = require("express-validator");
const { Payment } = require("../models");

const validate = {
  validateOrder: [
    check("address")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Address is required and should be a string"),
    check("district")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("District is required and should be a string"),
    check("phone")
      .trim()
      .isString()
      .withMessage("Phone number is required")
      .isLength({ min: 1 })
      .withMessage("Phone number is required")
      .custom((value) => {
        if (value.length === 11) return true;
        throw new Error("Phone number should be 11 digits");
      }),
    check("name")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Name is required and should be a string"),
    check("additionalInfo")
      .trim()
      .isString()
      .withMessage("Additional info is required and should be a string"),
    check("paymentMethod")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Payment method is required and should be a string"),
  ],
};

module.exports = validate;
