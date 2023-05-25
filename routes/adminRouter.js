const router = require("express").Router();
const adminCtrl = require("../controllers/adminCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.route("/admin/dashboard-count", authAdmin).get(adminCtrl.getDashboardCount);
router.route("/admin/dashboard-analytics", authAdmin).get(adminCtrl.getTotalOrdersByDay);
router.route("/admin/dashboard-activities", authAdmin).get(adminCtrl.getRecentActivities);

module.exports = router;
