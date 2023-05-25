const router = require("express").Router();
const episodeCtrl = require("../controllers/episodeCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/episodes")
  .get(auth, episodeCtrl.getEpisodes)
  .post(authAdmin, episodeCtrl.createEpisode);

router
  .route("/episodes/:id")
  .get(auth, episodeCtrl.getEpisode)
  .delete(authAdmin, episodeCtrl.deleteEpisode)
  .put(authAdmin, episodeCtrl.updateEpisode);

module.exports = router;
