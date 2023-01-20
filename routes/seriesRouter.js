const router = require("express").Router()
const seriesCtrl = require("../controllers/seriesCtrl")

router.route("/series")
    .get(seriesCtrl.getAllSeries)
    .post(seriesCtrl.createSeries)

router.route("/series/:id")
    .get(seriesCtrl.getSingleSeries)
    .delete(seriesCtrl.deleteASeries)
    .put(seriesCtrl.updateASeries)

    module.exports = router