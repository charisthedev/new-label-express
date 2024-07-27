const router = require("express").Router();
const episodeCtrl = require("../controllers/episodeCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");
const checkCurrency = require("../middleware/location");

router
  .route("/")
  .get(checkCurrency,episodeCtrl.getEpisodes)
  .post(modifiedAuthAdmin("Series"), episodeCtrl.createEpisode);
router.route("/season/:id").get(checkCurrency,episodeCtrl.getSeasonEpisodes);
router
  .route("/:id")
  .get(checkCurrency,episodeCtrl.getEpisode)
  .delete(modifiedAuthAdmin("Series"), episodeCtrl.deleteEpisode)
  .put(modifiedAuthAdmin("Series"), episodeCtrl.updateEpisode);

module.exports = router;
