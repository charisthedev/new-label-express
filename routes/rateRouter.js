const router = require("express").Router();
const rateCtrl = require("../controllers/rateCtrl");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");

router.post("/", modifiedAuthAdmin("Rates"), rateCtrl.createRate);

router.get("/", modifiedAuthAdmin("Rates"),rateCtrl.getRates);

router.get("/:id", modifiedAuthAdmin("Rates"),rateCtrl.getRate);

router.patch("/:id", modifiedAuthAdmin("Rates"),rateCtrl.updateRate);

router.delete("/:id", modifiedAuthAdmin("Rates"), rateCtrl.deleteRate);

module.exports = router;
