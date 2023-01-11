const router = require("express").Router();
const genreCtrl = require("../controllers/genreCtrl");

router.post("/genre", genreCtrl.createGenre);

router.get("/genre", genreCtrl.getGenres);

router.get("/genre/:id", genreCtrl.getGenre);

router.delete("/genre/:id", genreCtrl.deleteGenre);

module.exports = router;
