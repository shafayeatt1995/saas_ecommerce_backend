const { check } = require("express-validator");
const { Payment } = require("../models");
const { isValidURL } = require("../utils");

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
          const bkashStatus = item.bkash.status;
          if (value == "false" && !bkashStatus) {
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
      .isIn(["percentage", "fixed", "full", "delivery", "none"])
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
          if (value == "false" && !codStatus) {
            throw new Error(
              `Please activated "Cash on Delivery" payment then you can deactivate.`
            );
          }
        }
        return true;
      }),
  ],
  marketingValidation: [
    check("gtm").trim().optional().isString().withMessage("GTM ID is required"),
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
    check("analytics")
      .trim()
      .optional()
      .isString()
      .withMessage("Analytics ID is required"),
  ],
  whatsappValidation: [
    check("whatsapp")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Whatsapp number is required"),
  ],
  socialLinkValidation: [
    check("facebook")
      .trim()
      .isString()
      .withMessage("Facebook is required")
      .custom((value) => {
        if (value === "" || isValidURL(value)) {
          return true;
        }
        throw new Error("Facebook should be a valid URL or empty");
      }),
    check("instagram")
      .trim()
      .isString()
      .withMessage("Instagram is required")
      .custom((value) => {
        if (value === "" || isValidURL(value)) {
          return true;
        }
        throw new Error("Instagram should be a valid URL or empty");
      }),
    check("linkedin")
      .trim()
      .isString()
      .withMessage("Linkedin is required")
      .custom((value) => {
        if (value === "" || isValidURL(value)) {
          return true;
        }
        throw new Error("Linkedin should be a valid URL or empty");
      }),
    check("twitter")
      .trim()
      .isString()
      .withMessage("Twitter is required")
      .custom((value) => {
        if (value === "" || isValidURL(value)) {
          return true;
        }
        throw new Error("Twitter should be a valid URL or empty");
      }),
    check("youtube")
      .trim()
      .isString()
      .withMessage("Youtube is required")
      .custom((value) => {
        if (value === "" || isValidURL(value)) {
          return true;
        }
        throw new Error("Youtube should be a valid URL or empty");
      }),
    check("tiktok")
      .trim()
      .isString()
      .withMessage("Tiktok is required")
      .custom((value) => {
        if (value === "" || isValidURL(value)) {
          return true;
        }
        throw new Error("Tiktok should be a valid URL or empty");
      }),
    check("discord")
      .trim()
      .isString()
      .withMessage("Discord is required")
      .custom((value) => {
        if (value === "" || isValidURL(value)) {
          return true;
        }
        throw new Error("Discord should be a valid URL or empty");
      }),
    check("telegram")
      .trim()
      .isString()
      .withMessage("Telegram is required")
      .custom((value) => {
        if (value === "" || isValidURL(value)) {
          return true;
        }
        throw new Error("Telegram should be a valid URL or empty");
      }),
    check("daraz")
      .trim()
      .isString()
      .withMessage("Daraz is required")
      .custom((value) => {
        if (value === "" || isValidURL(value)) {
          return true;
        }
        throw new Error("Daraz should be a valid URL or empty");
      }),
    check("amazon")
      .trim()
      .isString()
      .withMessage("Amazon is required")
      .custom((value) => {
        if (value === "" || isValidURL(value)) {
          return true;
        }
        throw new Error("Amazon should be a valid URL or empty");
      }),
    check("walmart")
      .trim()
      .isString()
      .withMessage("Walmart is required")
      .custom((value) => {
        if (value === "" || isValidURL(value)) {
          return true;
        }
        throw new Error("Walmart should be a valid URL or empty");
      }),
    check("snapchat")
      .trim()
      .isString()
      .withMessage("Snapchat is required")
      .custom((value) => {
        if (value === "" || isValidURL(value)) {
          return true;
        }
        throw new Error("Snapchat should be a valid URL or empty");
      }),
  ],
};

module.exports = validate;
