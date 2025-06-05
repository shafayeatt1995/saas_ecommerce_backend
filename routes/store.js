const express = require("express");
const {
  Store,
  Marketing,
  Product,
  Category,
  Coupon,
  Delivery,
  Payment,
} = require("../models");
const { objectID, paginate, sendError, parseError } = require("../utils");
const { productCardPreset, categoryPreset } = require("../utils/preset");
const { validateOrder } = require("../validation/order");
const { validation } = require("../validation");
const router = express.Router();

const getPrice = (item = []) =>
  item?.variation.reduce((acc, variation) => {
    return acc + +variation.options?.price || 0;
  }, +item.price || 0) * (item?.quantity || 1);
const getDiscount = (item = []) =>
  item?.variation.reduce(
    (acc, variation) => {
      return acc + +variation.options?.discount || 0;
    },
    item?.discountStatus ? +item?.discountPrice || 0 : 0
  ) * (item?.quantity || 1);
const subtotal = (items = []) =>
  items.reduce((acc, item) => {
    return acc + getPrice(item);
  }, 0);
const subDiscount = (items = []) =>
  items.reduce((acc, item) => {
    return acc + getDiscount(item);
  }, 0);

router.get("/fetch", async (req, res) => {
  try {
    const { id } = req.query;
    const store = await Store.findOne({
      id,
      expiredAt: { $gte: new Date() },
    }).select({
      expiredAt: 0,
      userID: 0,
      type: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    const marketing = await Marketing.findOne({ storeID: store._id });
    res.json({ store, marketing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/fetch-home", async (req, res) => {
  try {
    const { storeID } = req.query;
    const items = await Category.aggregate([
      { $match: { storeID: objectID(storeID) } },
      { $sort: { id: 1 } },
    ]);

    const products = await Promise.all(
      items.map(
        async ({ _id }) =>
          await Product.aggregate([
            {
              $match: {
                storeID: objectID(storeID),
                categoryIDs: { $in: [_id] },
                status: true,
              },
            },
            { $sort: { _id: -1 } },
            { $limit: 4 },
            { $project: productCardPreset },
          ])
      )
    );
    res.json({ items, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/fetch-product", async (req, res) => {
  try {
    const { storeID, slug } = req.query;
    const product = await Product.findOne({
      storeID: objectID(storeID),
      slug,
      status: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    const relatedProducts = await Product.aggregate([
      {
        $match: {
          _id: { $ne: objectID(product._id) },
          storeID: objectID(storeID),
          categoryIDs: { $in: product.categoryIDs.map((id) => objectID(id)) },
          status: true,
        },
      },
      { $sample: { size: 4 } },
      { $project: productCardPreset },
    ]);

    res.json({ product, relatedProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/fetch-category-page", async (req, res) => {
  try {
    const { storeID } = req.query;

    const categories = await Category.aggregate([
      { $match: { storeID: objectID(storeID) } },
      { $sort: { id: 1 } },
      { $project: categoryPreset },
    ]);
    res.json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.post("/fetch-category-product", async (req, res) => {
  try {
    const { storeID, categoryID, page = 1, perPage = 24 } = req.body;
    const matchQuery = { storeID: objectID(storeID), status: true };
    if (categoryID) {
      const findCategory = await Category.findOne({
        storeID: objectID(storeID),
        id: categoryID,
      });
      matchQuery.categoryIDs = { $in: [objectID(findCategory._id)] };
    }
    const [products, total] = await Promise.all([
      Product.aggregate([
        { $match: matchQuery },
        { $sort: { _id: -1 } },
        ...paginate(page, perPage),
        { $project: productCardPreset },
      ]),
      Product.countDocuments(matchQuery),
    ]);

    res.json({ products, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.post("/apply-coupon", async (req, res) => {
  try {
    const { storeID, coupon, items, total, discount } = req.body;
    const findCoupon = await Coupon.findOne({
      storeID: objectID(storeID),
      code: coupon,
      status: true,
      expireDate: { $gte: new Date() },
    });

    if (!findCoupon) sendError({ message: "Invalid coupon" });

    const products = await Product.find({
      _id: { $in: items.map((item) => objectID(item._id)) },
    })
      .select({
        price: 1,
        variation: 1,
        discountStatus: 1,
        discountPrice: 1,
      })
      .lean();

    const newProducts = products.map((product) => {
      const item = items.find(
        (item) => item._id.toString() === product._id.toString()
      );
      const updateVariant = product.variation.map((variation) => {
        const newVariation = variation.options.find((option) => {
          const findItem = item.variation.find(
            (v) => v._id.toString() === variation._id.toString()
          );
          return option._id.toString() === findItem.option._id.toString();
        });
        return { ...variation, options: newVariation };
      });
      return { ...product, variation: updateVariant, quantity: item.quantity };
    });
    const newTotal = subtotal(newProducts);
    const newDiscount = subDiscount(newProducts);
    const grandTotal = newTotal - newDiscount;

    if (newTotal !== total || newDiscount !== discount)
      sendError({ message: "Invalid coupon" });
    if (findCoupon.minPurchase && grandTotal < findCoupon.minPurchaseAmount)
      sendError({
        message: `Minimum order amount ${findCoupon.minPurchaseAmount} taka to use this coupon`,
      });
    let totalDiscount = 0;
    if (findCoupon.type === "percent") {
      const discountAmount = Math.round(
        (grandTotal * findCoupon.discountPercent) / 100
      );
      totalDiscount = findCoupon.maxDiscount
        ? discountAmount > findCoupon.maxDiscountAmount
          ? findCoupon.maxDiscountAmount
          : discountAmount
        : discountAmount;
    } else if (findCoupon.type === "amount") {
      totalDiscount =
        findCoupon.maxDiscount &&
        findCoupon.discountAmount > findCoupon.maxDiscountAmount
          ? findCoupon.maxDiscountAmount
          : findCoupon.discountAmount;
    }

    res.json({ totalDiscount });
  } catch (error) {
    console.error(error);
    res.status(422).json(parseError(error));
  }
});
router.post("/cart-validate-items", async (req, res) => {
  try {
    const { items } = req.body;
    const products = await Product.find({
      _id: { $in: items },
    }).select({ _id: 1, updatedAt: 1 });
    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/checkout-info", async (req, res) => {
  try {
    const { storeID } = req.query;
    const addresses = await Delivery.find({ storeID });
    const findPayment = await Payment.findOne({ storeID });
    const payment = {
      cod: findPayment.cod.status
        ? { ...findPayment.cod, status: undefined }
        : undefined,
      bkash: findPayment.bkash.status
        ? { ...findPayment.bkash, status: undefined }
        : undefined,
    };
    res.json({ addresses, payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.post("/create-order", validateOrder, validation, async (req, res) => {
  try {
    const {
      additionalInfo,
      address,
      district,
      extraInfo,
      name,
      paymentMethod,
      phone,
      shippingAddress,
    } = req.body;
    const { storeID, coupon, couponDiscount, discount, items, total } =
      extraInfo;
    console.log(req.body);

    const findCoupon = await Coupon.findOne({
      storeID: objectID(storeID),
      code: coupon,
      status: true,
      expireDate: { $gte: new Date() },
    });

    if (coupon) {
      if (!findCoupon) sendError({ message: "Invalid coupon" });

      const products = await Product.find({
        _id: { $in: items.map((item) => objectID(item._id)) },
      })
        .select({
          price: 1,
          variation: 1,
          discountStatus: 1,
          discountPrice: 1,
        })
        .lean();

      const newProducts = products.map((product) => {
        const item = items.find(
          (item) => item._id.toString() === product._id.toString()
        );
        const updateVariant = product.variation.map((variation) => {
          const newVariation = variation.options.find((option) => {
            const findItem = item.variation.find(
              (v) => v._id.toString() === variation._id.toString()
            );
            return option._id.toString() === findItem.option._id.toString();
          });
          return { ...variation, options: newVariation };
        });
        return {
          ...product,
          variation: updateVariant,
          quantity: item.quantity,
        };
      });
      const newTotal = subtotal(newProducts);
      const newDiscount = subDiscount(newProducts);
      const grandTotal = newTotal - newDiscount;

      if (newTotal !== total || newDiscount !== discount)
        sendError({ message: "Invalid coupon" });
      if (findCoupon.minPurchase && grandTotal < findCoupon.minPurchaseAmount)
        sendError({
          message: `Minimum order amount ${findCoupon.minPurchaseAmount} taka to use this coupon`,
        });
      let totalDiscount = 0;
      if (findCoupon.type === "percent") {
        const discountAmount = Math.round(
          (grandTotal * findCoupon.discountPercent) / 100
        );
        totalDiscount = findCoupon.maxDiscount
          ? discountAmount > findCoupon.maxDiscountAmount
            ? findCoupon.maxDiscountAmount
            : discountAmount
          : discountAmount;
      } else if (findCoupon.type === "amount") {
        totalDiscount =
          findCoupon.maxDiscount &&
          findCoupon.discountAmount > findCoupon.maxDiscountAmount
            ? findCoupon.maxDiscountAmount
            : findCoupon.discountAmount;
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
