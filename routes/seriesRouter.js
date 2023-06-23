const router = require("express").Router();
const seriesCtrl = require("../controllers/seriesCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/")
  .get(seriesCtrl.getAllSeries)
  .post(authAdmin, seriesCtrl.createSeries);

router
  .route("/:id")
  .get(seriesCtrl.getSingleSeries)
  .delete(authAdmin, seriesCtrl.deleteASeries)
  .put(authAdmin, seriesCtrl.updateASeries);

module.exports = router;
