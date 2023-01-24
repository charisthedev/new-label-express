const router = require("express").Router();
const discountCtrl = require("../controllers/discountCtrl");

router.post("/discount", discountCtrl.createDiscount);
router.get("/discount", discountCtrl.getAllDiscounts);
router
  .route("/discount/:id")
  .get(discountCtrl.getSingleDiscount)
  .put(discountCtrl.updateDiscount)
  .delete(discountCtrl.deleteDiscount);

module.exports = router;
