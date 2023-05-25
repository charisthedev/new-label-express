const router = require("express").Router();
const continueWatchingCtrl = require("../controllers/continueWatchingCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.route("/continue-watching").get(auth, continueWatchingCtrl.getLastWatchedContents)

router.route("/continue-watching").post(auth, continueWatchingCtrl.createLastWatchedContents)
    

module.exports = router;
