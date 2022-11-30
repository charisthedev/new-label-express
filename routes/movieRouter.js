const router = require("express").Router();
const movieCtrl = require("../controllers/movieCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.route("/movies").get(movieCtrl.getMovies).post(movieCtrl.createMovie);

router
  .route("/movies/:id")
  .get(movieCtrl.getMovie)
  .delete(auth, authAdmin, movieCtrl.deleteMovie)
  .put(movieCtrl.updateMovie);
  
router.route("/movies/player/:id").get(movieCtrl.getVideoUrl)

module.exports = router;
