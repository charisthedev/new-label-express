const router = require("express").Router();
const bannerCtrl = require("../controllers/bannerCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.route("/banner/:type").get(bannerCtrl.getBanner);
router.route("/banner/client/:type").get(bannerCtrl.getBannerClient);

router.route("/banner").get(bannerCtrl.getBanners);

router.route("/banner").post(bannerCtrl.createBanner);

router
  .route("/banner/:type")
  .delete(bannerCtrl.deleteBanner)
  .put(bannerCtrl.updateBanner);

module.exports = router;
