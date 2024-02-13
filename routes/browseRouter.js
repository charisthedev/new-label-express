const router = require("express").Router();
const browseCtrl = require("../controllers/browseCtrl");

router.route("/").get(browseCtrl.browseItems);
module.exports = router;
