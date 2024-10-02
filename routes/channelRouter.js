const router = require("express").Router();
const channelCtrl = require("../controllers/channelCtrl");
const checkCurrency = require("../middleware/location");

router.route("/").get(checkCurrency,channelCtrl.getChannels);
router.route("/:id").get(checkCurrency,channelCtrl.getSingleChannel);
module.exports = router;
