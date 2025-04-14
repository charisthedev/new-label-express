const router = require("express").Router();
const seriesCtrl = require("../controllers/seriesCtrl");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");
const checkCurrency = require("../middleware/location");

router
  .route("/")
  .get(checkCurrency, seriesCtrl.getAllSeries)
  .post(modifiedAuthAdmin("Series"), seriesCtrl.createSeries);

router
  .route("/:id")
  .get(checkCurrency, seriesCtrl.getSingleSeries)
  .delete(modifiedAuthAdmin("Series"), seriesCtrl.deleteASeries)
  .put(modifiedAuthAdmin("Series"), seriesCtrl.updateASeries);

module.exports = router;
