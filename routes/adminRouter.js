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
router.route("/user/:id", authAdmin).get(adminCtrl.getUser);
router.route("/make-admin", authAdmin).put(adminCtrl.makeUserAdmin);
router.route("", authAdmin).post(adminCtrl.createAdmin).get(adminCtrl.getAdmin);
router
  .route("/:id", authAdmin)
  .get(adminCtrl.getAdminById)
  .patch(adminCtrl.updateAdmin);
router
  .route("/permission", authAdmin)
  .post(adminCtrl.createPermission)
  .get(adminCtrl.getPermissions);
router
  .route("/role", authAdmin)
  .post(adminCtrl.createRole)
  .get(adminCtrl.getRoles);
router
  .route("/role/:id", authAdmin)
  .get(adminCtrl.getRoleById)
  .patch(adminCtrl.updateRole);
module.exports = router;
