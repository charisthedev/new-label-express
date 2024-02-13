const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.post("/register", userCtrl.register);

router.post("/login", userCtrl.login);

router.post("/resetpassword", userCtrl.resetPassword);

router.post("/changepassword", userCtrl.changePassword);

router.get("/me", auth, userCtrl.getMe);

router.get("/:id", authAdmin, userCtrl.getUser);

router.patch("/addcart", auth, userCtrl.addCart);

router.patch("/update", auth, userCtrl.updateUser);

router.patch("/updatepassword", auth, userCtrl.updatePassword);

router.get("/history", auth, userCtrl.history);

router.put("/make-admin", authAdmin, userCtrl.makeUserAdmin);

module.exports = router;
