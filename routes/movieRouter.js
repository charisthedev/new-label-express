const router = require("express").Router();
const movieCtrl = require("../controllers/movieCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");

router
  .route("/")
  .get(movieCtrl.getMovies)
  .post(modifiedAuthAdmin("Movies"), movieCtrl.createMovie);

router
  .route("/:id")
  .get(movieCtrl.getMovie)
  .delete(modifiedAuthAdmin("Movies"), movieCtrl.deleteMovie)
  .put(modifiedAuthAdmin("Movies"), movieCtrl.updateMovie);

router.route(auth, "/player/:id").get(movieCtrl.getVideoUrl);

module.exports = router;
