const router = require('express').Router()
const bannerCtrl = require('../controllers/bannerCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/banner/:type')
    .get(bannerCtrl.getBanner)
    
    
router.route('/banner')
    .post(bannerCtrl.createBanner)
    

router.route('/banner/:id')
    .delete(bannerCtrl.deleteBanner)
    .put(bannerCtrl.updateBanner)


module.exports = router