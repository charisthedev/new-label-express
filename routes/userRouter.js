const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.post("/register", userCtrl.register);

router.post("/login", userCtrl.login);

router.get("/:id", authAdmin, userCtrl.getUser);

router.patch("/addcart", auth, userCtrl.addCart);

router.get("/history", auth, userCtrl.history);

router.put("/make-admin", authAdmin, userCtrl.makeUserAdmin);

module.exports = router;
