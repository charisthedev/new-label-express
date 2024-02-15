const router = require("express").Router();
const adminCtrl = require("../controllers/adminCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.route("/dashboard-count", authAdmin).get(adminCtrl.getDashboardCount);
router
  .route("/dashboard-analytics", authAdmin)
  .get(adminCtrl.getTotalOrdersByDay);
router
  .route("/dashboard-activities", authAdmin)
  .get(adminCtrl.getRecentActivities);
router.route("/user/:id",authAdmin).get(adminCtrl.getUser);
router.route("/make-admin",authAdmin).put(adminCtrl.makeUserAdmin);
module.exports = router;
