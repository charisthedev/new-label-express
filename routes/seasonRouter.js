const router = require('express').Router()
const seasonCtrl = require('../controllers/seasonCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/seasons')
    .get(seasonCtrl.getSeasons)
    .post(seasonCtrl.createSeason)


router.route('/seasons/:id')
    .get(seasonCtrl.getSeason)
    .delete(auth, authAdmin, seasonCtrl.deleteSeason)
    .put(auth, authAdmin, seasonCtrl.updateSeason)



module.exports = router