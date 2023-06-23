const router = require("express").Router();
const sectionCtrl = require("../controllers/sectionCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/")
  .get(sectionCtrl.getSections)
  .post(authAdmin, sectionCtrl.createSection);

router
  .route("/:id")
  .get(sectionCtrl.getSection)
  .delete(authAdmin, sectionCtrl.deleteSection)
  .put(authAdmin, sectionCtrl.updateSection);

router.route("/search").get(sectionCtrl.searchProduct);

module.exports = router;
