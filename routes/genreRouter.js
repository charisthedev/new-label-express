const router = require("express").Router();
const genreCtrl = require("../controllers/genreCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.post("/", authAdmin, genreCtrl.createGenre);

router.get("/", genreCtrl.getGenres);

router.get("/:id", genreCtrl.getGenre);

router.delete("/:id", authAdmin, genreCtrl.deleteGenre);

module.exports = router;
