const router = require("express").Router();
const genreCtrl = require("../controllers/genreCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.post("/genre", authAdmin, genreCtrl.createGenre);

router.get("/genre", auth, genreCtrl.getGenres);

router.get("/genre/:id", auth, genreCtrl.getGenre);

router.delete("/genre/:id", authAdmin, genreCtrl.deleteGenre);

module.exports = router;
