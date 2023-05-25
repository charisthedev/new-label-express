const router = require("express").Router();
const discountCtrl = require("../controllers/discountCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.post("/discount", authAdmin, discountCtrl.createDiscount);
router.get("/discount", authAdmin, discountCtrl.getAllDiscounts);
router
  .route("/discount/:id")
  .get(authAdmin, discountCtrl.getSingleDiscount)
  .put(authAdmin, discountCtrl.updateDiscount)
  .delete(authAdmin, discountCtrl.deleteDiscount);

module.exports = router;
