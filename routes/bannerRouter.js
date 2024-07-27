const router = require("express").Router();
const bannerCtrl = require("../controllers/bannerCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");
const checkCurrency = require("../middleware/location");

router.route("/:type").get(checkCurrency,bannerCtrl.getBanner);
router.route("/client/:type").get(checkCurrency,bannerCtrl.getBannerClient);

router.route("/").get(checkCurrency,bannerCtrl.getBanners);

router.route("/").post(modifiedAuthAdmin("Banners"), bannerCtrl.createBanner);

router
  .route("/:type")
  .delete(modifiedAuthAdmin("Banners"), bannerCtrl.deleteBanner)
  .put(modifiedAuthAdmin("Banners"), bannerCtrl.updateBanner);

module.exports = router;
