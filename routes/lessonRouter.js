const router = require("express").Router();
const lessonCtrl = require("../controllers/lessonCtrl");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");
const checkCurrency = require("../middleware/location");

router
  .route("/")
  .get(checkCurrency,lessonCtrl.getLessons)
  .post(modifiedAuthAdmin("Course"), lessonCtrl.createLesson);
router.route("/course/:id").get(checkCurrency,lessonCtrl.getCourseLessons);
router
  .route("/:id")
  .get(checkCurrency,lessonCtrl.getLesson)
  .delete(modifiedAuthAdmin("Course"), lessonCtrl.deleteLesson)
  .put(modifiedAuthAdmin("Course"), lessonCtrl.updateLesson);

module.exports = router;
