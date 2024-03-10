const router = require("express").Router();
const paymentCtrl = require("../controllers/paymentCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");

router
  .route("/")
  .get(authAdmin, paymentCtrl.getOrders)
  .post(auth, paymentCtrl.createOrderFromWallet);

router.route("/verify").post(auth, paymentCtrl.verifyItemPurchase);
router.route("/topup").post(auth, paymentCtrl.topUpWallet);
router
  .route("/user")
  .get(modifiedAuthAdmin("Orders"), paymentCtrl.getUserOrders);
router.route("/card-payment").post(auth, paymentCtrl.createOrderFromCard);
router.route("/coupon").post(auth, paymentCtrl.verifyDiscount);

router.route("/:id");
//   .get(movieCtrl.getMovie)
//   .delete(auth, authAdmin, movieCtrl.deleteMovie)
//   .put(movieCtrl.updateMovie);

module.exports = router;
