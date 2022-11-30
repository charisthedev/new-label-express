const router = require("express").Router();
const paymentCtrl = require("../controllers/paymentCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/orders")
  .get(paymentCtrl.getOrders)
  .post(paymentCtrl.createOrderFromWallet);

router.route("/orders/verify").post(paymentCtrl.verifyItemPurchase);
router.route("/orders/topup").post(paymentCtrl.topUpWallet);
router.route("/orders/user/").get(paymentCtrl.getUserOrders)
router.route("/orders/card-payment").post(paymentCtrl.createOrderFromCard)

router.route("/orders/:id");
//   .get(movieCtrl.getMovie)
//   .delete(auth, authAdmin, movieCtrl.deleteMovie)
//   .put(movieCtrl.updateMovie);

module.exports = router;
