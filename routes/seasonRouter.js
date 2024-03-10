const router = require("express").Router();
const seasonCtrl = require("../controllers/seasonCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");

router
  .route("/")
  .get(seasonCtrl.getSeasons)
  .post(modifiedAuthAdmin("Series"), seasonCtrl.createSeason);

router.route("/series/:id").get(seasonCtrl.getSeriesSeason);
router
  .route("/:id")
  .get(seasonCtrl.getSeason)
  .delete(modifiedAuthAdmin("Series"), seasonCtrl.deleteSeason)
  .put(modifiedAuthAdmin("Series"), seasonCtrl.updateSeason);

module.exports = router;
