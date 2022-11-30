const router = require('express').Router()
const episodeCtrl = require('../controllers/episodeCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/episodes')
    .get(episodeCtrl.getEpisodes)
    .post(episodeCtrl.createEpisode)


router.route('/episodes/:id')
    .get(episodeCtrl.getEpisode)
    .delete(auth, authAdmin, episodeCtrl.deleteEpisode)
    .put(auth, authAdmin, episodeCtrl.updateEpisode)



module.exports = router