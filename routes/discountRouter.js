const router = require("express").Router();
const discountCtrl = require("../controllers/discountCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");

router.post("/", modifiedAuthAdmin("Coupons"), discountCtrl.createDiscount);
router.get("/", modifiedAuthAdmin("Coupons"), discountCtrl.getAllDiscounts);
router
  .route("/:id")
  .get(modifiedAuthAdmin("Coupons"), discountCtrl.getSingleDiscount)
  .put(modifiedAuthAdmin("Coupons"), discountCtrl.updateDiscount)
  .delete(modifiedAuthAdmin("Coupons"), discountCtrl.deleteDiscount);

module.exports = router;
