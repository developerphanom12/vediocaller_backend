const  express = require('express')
const router = express.Router();
const AdminCreator =  require('../Controller/admincontroller');
const { addsubscription } = require('../validation/validation');
const authenticateToken = require('../Middleware/Authentication');

router.post('/subscription',addsubscription,authenticateToken, AdminCreator.subscriptionadd)


router.post('/subscriptionss', AdminCreator.addSubscriptionControllerss)

module.exports = router