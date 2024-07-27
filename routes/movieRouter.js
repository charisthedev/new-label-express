const router = require("express").Router();
const movieCtrl = require("../controllers/movieCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");
const checkCurrency = require("../middleware/location");

router
  .route("/")
  .get(checkCurrency,movieCtrl.getMovies)
  .post(modifiedAuthAdmin("Movies"), movieCtrl.createMovie);

router
  .route("/:id")
  .get(checkCurrency,movieCtrl.getMovie)
  .delete(modifiedAuthAdmin("Movies"), movieCtrl.deleteMovie)
  .put(modifiedAuthAdmin("Movies"), movieCtrl.updateMovie);

router.route(auth, "/player/:id").get(movieCtrl.getVideoUrl);

module.exports = router;
