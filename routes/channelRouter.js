const router = require("express").Router();
const channelCtrl = require("../controllers/channelCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.route("/").get(channelCtrl.getChannels);

module.exports = router;
