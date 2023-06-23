const router = require("express").Router();
const bannerCtrl = require("../controllers/bannerCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.route("/:type").get(bannerCtrl.getBanner);
router.route("/client/:type").get(bannerCtrl.getBannerClient);

router.route("/").get(bannerCtrl.getBanners);

router.route("/").post(authAdmin, bannerCtrl.createBanner);

router
  .route("/:type")
  .delete(authAdmin, bannerCtrl.deleteBanner)
  .put(authAdmin, bannerCtrl.updateBanner);

module.exports = router;
