const router = require("express").Router();
const continueWatchingCtrl = require("../controllers/continueWatchingCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.route("/continue-watching/:id").get(continueWatchingCtrl.getLastWatchedContents)

router.route("/continue-watching").post(continueWatchingCtrl.createLastWatchedContents)
    

module.exports = router;
