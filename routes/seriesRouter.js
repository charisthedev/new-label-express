const router = require("express").Router();
const seriesCtrl = require("../controllers/seriesCtrl");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");

router
  .route("/")
  .get(seriesCtrl.getAllSeries)
  .post(modifiedAuthAdmin("Series"), seriesCtrl.createSeries);

router
  .route("/:id")
  .get(seriesCtrl.getSingleSeries)
  .delete(modifiedAuthAdmin("Series"), seriesCtrl.deleteASeries)
  .put(modifiedAuthAdmin("Series"), seriesCtrl.updateASeries);

module.exports = router;
