const router = require("express").Router();
const discountCtrl = require("../controllers/discountCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.post("/", authAdmin, discountCtrl.createDiscount);
router.get("/", authAdmin, discountCtrl.getAllDiscounts);
router
  .route("/:id")
  .get(authAdmin, discountCtrl.getSingleDiscount)
  .put(authAdmin, discountCtrl.updateDiscount)
  .delete(authAdmin, discountCtrl.deleteDiscount);

module.exports = router;
