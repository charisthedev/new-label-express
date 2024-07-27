const router = require("express").Router();
const courseCtrl = require("../controllers/courseCtrl");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");
const auth = require("../middleware/auth");
const checkCurrency = require("../middleware/location")

router
  .route("/")
  .get(checkCurrency,courseCtrl.getAllCourse)
  .post(modifiedAuthAdmin("Course"), courseCtrl.createCourse);

router
  .route("/:id")
  .get(checkCurrency,courseCtrl.getSingleCourse)
  .delete(modifiedAuthAdmin("Course"), courseCtrl.deleteCourse)
  .put(modifiedAuthAdmin("Course"), courseCtrl.updateCourse);
router.route("/:id/certificate").get(auth,courseCtrl.requestCertificate)

module.exports = router;
