const router = require("express").Router();
const sectionCtrl = require("../controllers/sectionCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/")
  .get(auth, sectionCtrl.getSections)
  .post(authAdmin, sectionCtrl.createSection);

router
  .route("/:id")
  .get(auth, sectionCtrl.getSection)
  .delete(authAdmin, sectionCtrl.deleteSection)
  .put(auth, sectionCtrl.updateSection);

router.route("/search").get(auth, sectionCtrl.searchProduct);

module.exports = router;
