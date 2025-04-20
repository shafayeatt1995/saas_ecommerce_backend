const isStore = async (req, res, next) => {
  try {
    const { storeid } = req.headers;
    if (storeid) {
      req.storeID = storeid;
      next();
    } else {
      throw new Error("Store not selected");
    }
  } catch (error) {
    return res.status(401).send({ success: false, message: "Unauthorized" });
  }
};

module.exports = isStore;
