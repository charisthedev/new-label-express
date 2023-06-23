const router = require("express").Router();
const movieCtrl = require("../controllers/movieCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.route("/").get(movieCtrl.getMovies).post(authAdmin, movieCtrl.createMovie);

router
  .route("/:id")
  .get(movieCtrl.getMovie)
  .delete(authAdmin, movieCtrl.deleteMovie)
  .put(authAdmin, movieCtrl.updateMovie);

router.route("/player/:id").get(movieCtrl.getVideoUrl);

module.exports = router;
