const { check } = require("express-validator");

const validate = {
  deliveryValidation: [
    check("address")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Address is required"),
    check("charge")
      .trim()
      .isNumeric()
      .withMessage("Charge is required")
      .custom((value) => value >= 0)
      .withMessage("Charge should be greater than or equal to 0"),
  ],
};

module.exports = validate;
