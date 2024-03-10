const router = require("express").Router();
const bannerCtrl = require("../controllers/bannerCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");

router.route("/:type").get(bannerCtrl.getBanner);
router.route("/client/:type").get(bannerCtrl.getBannerClient);

router.route("/").get(bannerCtrl.getBanners);

router.route("/").post(modifiedAuthAdmin("Banners"), bannerCtrl.createBanner);

router
  .route("/:type")
  .delete(modifiedAuthAdmin("Banners"), bannerCtrl.deleteBanner)
  .put(modifiedAuthAdmin("Banners"), bannerCtrl.updateBanner);

module.exports = router;
