const router = require("express").Router();
const genreCtrl = require("../controllers/genreCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const modifiedAuthAdmin = require("../middleware/modifiedAuthAdmin");

router.post("/", modifiedAuthAdmin("Genres"), genreCtrl.createGenre);

router.get("/", genreCtrl.getGenres);

router.get("/:id", genreCtrl.getGenre);

router.patch("/:id", modifiedAuthAdmin("Genres"),genreCtrl.updateGenre);

router.delete("/:id", modifiedAuthAdmin("Genres"), genreCtrl.deleteGenre);

module.exports = router;
