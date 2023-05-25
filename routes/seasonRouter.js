const router = require("express").Router();
const seasonCtrl = require("../controllers/seasonCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/seasons")
  .get(auth, seasonCtrl.getSeasons)
  .post(authAdmin, seasonCtrl.createSeason);

router
  .route("/seasons/:id")
  .get(auth, seasonCtrl.getSeason)
  .delete(authAdmin, seasonCtrl.deleteSeason)
  .put(authAdmin, seasonCtrl.updateSeason);

module.exports = router;
