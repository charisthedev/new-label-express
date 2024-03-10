const router = require("express").Router();
const adminCtrl = require("../controllers/adminCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.route("/dashboard-count").get(authAdmin, adminCtrl.getDashboardCount);
router
  .route("/dashboard-analytics")
  .get(authAdmin, adminCtrl.getTotalOrdersByDay);
router
  .route("/dashboard-activities")
  .get(authAdmin, adminCtrl.getRecentActivities);
router.route("/all-activities").get(authAdmin, adminCtrl.getAllActivities);
router.route("/getuser/:id").get(authAdmin, adminCtrl.getUser);
router.route("/me").get(authAdmin, adminCtrl.getMe);
router.route("/make-admin").put(authAdmin, adminCtrl.makeUserAdmin);
router
  .route("/user")
  .post(authAdmin, adminCtrl.createAdmin)
  .get(authAdmin, adminCtrl.getAdmin);
router
  .route("/user/:id")
  .get(authAdmin, adminCtrl.getAdminById)
  .patch(authAdmin, adminCtrl.updateAdmin);
router
  .route("/permission")
  .get(authAdmin, adminCtrl.getPermissions)
  .post(authAdmin, adminCtrl.createPermission);

router
  .route("/role")
  .get(authAdmin, adminCtrl.getRoles)
  .post(authAdmin, adminCtrl.createRole);
router
  .route("/role/:id")
  .get(authAdmin, adminCtrl.getRoleById)
  .patch(authAdmin, adminCtrl.updateRole);
module.exports = router;
