const router = require("express").Router();
const bannerCtrl = require("../controllers/bannerCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.route("/banner/:type").get(auth, bannerCtrl.getBanner);
router.route("/banner/client/:type").get(auth, bannerCtrl.getBannerClient);

router.route("/banner").get(auth, bannerCtrl.getBanners);

router.route("/banner").post(authAdmin, bannerCtrl.createBanner);

router
  .route("/banner/:type")
  .delete(authAdmin, bannerCtrl.deleteBanner)
  .put(authAdmin, bannerCtrl.updateBanner);

module.exports = router;
