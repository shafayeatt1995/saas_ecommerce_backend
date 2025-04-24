const { check } = require("express-validator");
const { Payment } = require("../models");

const validate = {
  codValidation: [
    check("message")
      .trim()
      .isString()
      .withMessage("Message is required")
      .isLength({ min: 1, max: 255 })
      .withMessage("Message must be between 1 and 255 characters"),
    check("status")
      .trim()
      .isBoolean()
      .withMessage("Status is required")
      .custom(async (value, { req }) => {
        const storeID = req.storeID;
        const item = await Payment.findOne({ storeID });
        if (item) {
          const codStatus = !item.cod.status;
          const bkashStatus = item.bkash.status;
          if (!codStatus && !bkashStatus) {
            throw new Error(
              `Please activated "Bkash" payment then you can deactivate.`
            );
          }
        }
        return true;
      }),
  ],
  bkashValidation: [
    check("appKey")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("App key is required"),
    check("secretKey")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Secret key is required"),
    check("username")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Username is required"),
    check("password")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Password is required"),
    check("message")
      .trim()
      .isString()
      .withMessage("Message is required")
      .isLength({ min: 1, max: 255 })
      .withMessage("Message must be between 1 and 255 characters"),
    check("type")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Type is required")
      .isIn(["percentage", "fixed", "full", "delivery"])
      .withMessage("Type is not valid"),
    check("value")
      .trim()
      .isNumeric()
      .withMessage("Value is required")
      .custom((value, { req }) => {
        const { type } = req.body;
        if (type === "percentage") {
          if (Number(value) >= 0 && Number(value) <= 100) {
            return true;
          }
          throw new Error("Percentage must be between 0 and 100");
        } else if (type === "fixed") {
          if (Number(value) >= 0) {
            return true;
          }
          throw new Error("Amount must be greater than or equal to 0");
        }
        return true;
      }),
    check("status")
      .trim()
      .isBoolean()
      .withMessage("Status is required")
      .custom(async (value, { req }) => {
        const storeID = req.storeID;
        const item = await Payment.findOne({ storeID });
        if (item) {
          const codStatus = item.cod.status;
          const bkashStatus = !item.bkash.status;
          if (!codStatus && !bkashStatus) {
            throw new Error(
              `Please activated "Cash on Delivery" payment then you can deactivate.`
            );
          }
        }
        return true;
      }),
  ],
  marketingValidation: [
    check("gtm").trim().optional().isString().withMessage("GTM is required"),
    check("pixelID")
      .trim()
      .optional()
      .isString()
      .withMessage("Pixel ID is required"),
    check("pixelToken")
      .trim()
      .optional()
      .isString()
      .withMessage("Pixel Token is required"),
    check("pixelEventID")
      .trim()
      .optional()
      .isString()
      .withMessage("Pixel Event ID is required"),
  ],
};

module.exports = validate;
