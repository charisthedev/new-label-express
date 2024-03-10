const router = require("express").Router();
const discountCtrl = require("../controllers/discountCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");

router.post("/", modifiedAuthAdmin("Coupon"), discountCtrl.createDiscount);
router.get("/", modifiedAuthAdmin("Coupon"), discountCtrl.getAllDiscounts);
router
  .route("/:id")
  .get(modifiedAuthAdmin("Coupon"), discountCtrl.getSingleDiscount)
  .put(modifiedAuthAdmin("Coupon"), discountCtrl.updateDiscount)
  .delete(modifiedAuthAdmin("Coupon"), discountCtrl.deleteDiscount);

module.exports = router;
