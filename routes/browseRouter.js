const router = require("express").Router();
const browseCtrl = require("../controllers/browseCtrl");
const checkCurrency = require("../middleware/location");

router.route("/").get(checkCurrency,browseCtrl.browseItems);
module.exports = router;
