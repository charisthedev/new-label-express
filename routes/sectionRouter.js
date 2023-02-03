const router = require("express").Router();
const sectionCtrl = require("../controllers/sectionCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/section")
  .get(sectionCtrl.getSections)
  .post(sectionCtrl.createSection);

router
  .route("/section/:id")
  .get(sectionCtrl.getSection)
  .delete(sectionCtrl.deleteSection)
  .put(sectionCtrl.updateSection);

router.route("/section/search").get(sectionCtrl.searchProduct);

module.exports = router;
