const router = require("express").Router();
const cloudinary = require("cloudinary");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const fs = require("fs");
const axios = require("axios");
const request = require("request");
const Mux = require("@mux/mux-node").default;
const { Video } = new Mux();

// we will upload image on cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  timeout: 60 * 1000, // 30 seconds
});

router.post("/upload", (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).json({ msg: "No files were uploaded." });

    const file = req.files.file;
    // if (file.size > 1024 * 1024) {
    //   removeTmp(file.tempFilePath);
    //   return res.status(400).json({ msg: "Size too large" });
    // }

    // if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
    //   removeTmp(file.tempFilePath);
    //   return res.status(400).json({ msg: "File format is incorrect." });
    // }

    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: "images" },
      async (err, result) => {
        if (err) throw err;

        removeTmp(file.tempFilePath);

        res.json({ public_id: result.public_id, url: result.secure_url });
      }
    );
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.post("/upload-asset", async (req, res) => {
  try {
    const upload = await Video.Uploads.create({
      new_asset_settings: { playback_policy: "public" },
      cors_origin: "*",
    });
    res.json({
      id: upload.id,
      url: upload.url,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error creating upload" });
  }
});

router.get("/get-asset/:id", async (req, res) => {
  try {
    const upload = await Video.Uploads.get(req.params.id);
    res.json({
      upload: upload.asset_id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error getting upload/asset" });
  }
});

router.get("/get-playback/:id", async (req, res) => {
  try {
    const asset = await Video.Assets.get(req.params.id);
    res.json({
      asset: {
        id: asset.id,
        status: asset.status,
        errors: asset.errors,
        playback_id: asset.playback_ids[0].id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Error getting upload/asset" });
  }
});

// Delete image only admin can use
router.post("/destroy", auth, authAdmin, (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ msg: "No images Selected" });

    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;

      res.json({ msg: "Deleted Image" });
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = router;
