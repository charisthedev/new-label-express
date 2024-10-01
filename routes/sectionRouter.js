const router = require("express").Router();
const sectionCtrl = require("../controllers/sectionCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");
const checkCurrency = require("../middleware/location");

router
  .route("/")
  .get(checkCurrency,sectionCtrl.getSections)
  .post(modifiedAuthAdmin("Sections"), sectionCtrl.createSection);

router
  .route("/:id")
  .get(checkCurrency,sectionCtrl.getSection)
  .delete(authAdmin, sectionCtrl.deleteSection)
  .put(modifiedAuthAdmin("Sections"), sectionCtrl.updateSection);

router.route("/search").get(checkCurrency,sectionCtrl.searchProduct);

module.exports = router;
