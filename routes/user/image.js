const express = require("express");
const { Image } = require("../../models");
const sharp = require("sharp");
const {
  randomKey,
  utapi,
  parseError,
  paginate,
  objectID,
} = require("../../utils");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { page, perPage, search, storeID } = req.query;
    const [items, totalImages] = await Promise.all([
      Image.aggregate([
        {
          $match: {
            storeID: objectID(storeID),
            name: { $regex: search, $options: "i" },
          },
        },
        { $sort: { _id: -1 } },
        ...paginate(page, perPage),
      ]),
      Image.countDocuments({
        storeID,
        name: { $regex: search, $options: "i" },
      }),
    ]);
    res.json({ items, totalImages });
  } catch (error) {
    console.error(error, parseError(error));
    return res.status(500).json(parseError(error));
  }
});
router.post("/", async (req, res) => {
  let keyList = null;
  try {
    const { store: storeID } = req.headers;
    const imageBuffer = req.files.image.data;
    const metadata = await sharp(imageBuffer).metadata();
    const shouldResize = metadata.width > 1000 || metadata.height > 1000;
    const webpBuffer = shouldResize
      ? await sharp(imageBuffer)
          .resize({
            width: 1000,
            height: 1000,
            fit: sharp.fit.inside,
            withoutEnlargement: true,
          })
          .webp({ quality: 80 })
          .toBuffer()
      : await sharp(imageBuffer).webp({ quality: 80 }).toBuffer();

    const filename = `${randomKey(10)}`;
    const blob = new Blob([webpBuffer], {
      type: "application/octet-stream",
    });
    const uploadData = Object.assign(blob, { name: filename });

    if (storeID) {
      const { data } = await utapi.uploadFiles(uploadData);
      const { url, size, key, name } = data;
      keyList = key;
      await Image.create({
        storeID,
        url,
        size,
        key,
        name,
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    if (keyList) {
      await utapi.deleteFiles([keyList]);
      await Image.findOneAndDelete({ key: keyList });
    }
    return res
      .status(500)
      .json({ success: false, message: "Something wrong. Please try again" });
  }
});
router.post("/delete", async (req, res) => {
  try {
    const { keyList, storeID } = req.body;
    await utapi.deleteFiles(keyList);
    await Image.deleteMany({
      key: { $in: keyList },
      storeID,
    });
    res.json({ success: true, message: "Images deleted successfully" });
  } catch (error) {
    console.error(error, parseError(error));
    return res.status(500).json(parseError(error));
  }
});
router.post("/update-name", async (req, res) => {
  try {
    const { _id, name } = req.body;
    await Image.findOneAndUpdate({ _id }, { name });
    res.json({ success: true, message: "Image name updated successfully" });
  } catch (error) {
    console.error(error, parseError(error));
    return res.status(500).json(parseError(error));
  }
});

module.exports = router;
