const router = require("express").Router();
const lessonCtrl = require("../controllers/lessonCtrl");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");

router
  .route("/")
  .get(lessonCtrl.getLessons)
  .post(modifiedAuthAdmin("Course"), lessonCtrl.createLesson);
router.route("/course/:id").get(lessonCtrl.getCourseLessons);
router
  .route("/:id")
  .get(lessonCtrl.getLesson)
  .delete(modifiedAuthAdmin("Course"), lessonCtrl.deleteLesson)
  .put(modifiedAuthAdmin("Course"), lessonCtrl.updateLesson);

module.exports = router;
