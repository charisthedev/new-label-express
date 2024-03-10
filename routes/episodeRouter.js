const router = require("express").Router();
const episodeCtrl = require("../controllers/episodeCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");

router
  .route("/")
  .get(episodeCtrl.getEpisodes)
  .post(modifiedAuthAdmin("Series"), episodeCtrl.createEpisode);
router.route("/season/:id").get(episodeCtrl.getSeasonEpisodes);
router
  .route("/:id")
  .get(episodeCtrl.getEpisode)
  .delete(modifiedAuthAdmin("Series"), episodeCtrl.deleteEpisode)
  .put(modifiedAuthAdmin("Series"), episodeCtrl.updateEpisode);

module.exports = router;
