const router = require("express").Router();
const categoryCtrl = require("../controllers/categoryCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");

router
  .route("/")
  .get(modifiedAuthAdmin("Channels"), categoryCtrl.getCategories)
  .post(modifiedAuthAdmin("Channels"), categoryCtrl.createCategory);

router
  .route("/:id", modifiedAuthAdmin("Channels"))
  .get(modifiedAuthAdmin("Channels"), categoryCtrl.getCategory)
  .delete(modifiedAuthAdmin("Channels"), categoryCtrl.deleteCategory)
  .put(modifiedAuthAdmin("Channels"), categoryCtrl.updateCategory);

module.exports = router;
