const router = require("express").Router();
const sectionCtrl = require("../controllers/sectionCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");

router
  .route("/")
  .get(sectionCtrl.getSections)
  .post(modifiedAuthAdmin("Sections"), sectionCtrl.createSection);

router
  .route("/:id")
  .get(sectionCtrl.getSection)
  .delete(authAdmin, sectionCtrl.deleteSection)
  .put(modifiedAuthAdmin("Sections"), sectionCtrl.updateSection);

router.route("/search").get(sectionCtrl.searchProduct);

module.exports = router;
