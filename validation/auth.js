const { check } = require("express-validator");
const { User } = require("../models");
const bcrypt = require("bcryptjs");

const validate = {
  loginValidation: [
    check("email")
      .trim()
      .custom(async (value, { req }) => {
        try {
          const { id } = req.body;
          const user = await User.findOne({ email: value }).select(
            "+password +suspended +power"
          );
          if (user) {
            const password = id + process.env.SOCIAL_LOGIN_PASS;
            const check = await bcrypt.compare(password, user.password);
            if (check) {
              if (user.suspended) {
                throw new Error(`Account suspended`);
              } else {
                const { _id, name, email, avatar, type, power } = user;
                req.authUser = { _id, name, email, avatar, type, power };
              }
            } else {
              throw new Error(`Login failed. Invalid credentials.`);
            }
          } else {
            throw new Error(`Login failed. Invalid credentials.`);
          }
          return true;
        } catch (err) {
          throw new Error(err.message);
        }
      }),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
};

module.exports = validate;
