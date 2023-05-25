const router = require("express").Router();
const paymentCtrl = require("../controllers/paymentCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/orders")
  .get(authAdmin, paymentCtrl.getOrders)
  .post(auth, paymentCtrl.createOrderFromWallet);

router.route("/orders/verify").post(auth, paymentCtrl.verifyItemPurchase);
router.route("/orders/topup").post(auth, paymentCtrl.topUpWallet);
router.route("/orders/user").get(auth, paymentCtrl.getUserOrders);
router.route("/orders/card-payment").post(auth, paymentCtrl.createOrderFromCard);

router.route("/orders/:id");
//   .get(movieCtrl.getMovie)
//   .delete(auth, authAdmin, movieCtrl.deleteMovie)
//   .put(movieCtrl.updateMovie);

module.exports = router;
