const  express = require('express')
const router = express.Router();
const userCreator =  require('../Controller/usercontroller');

router.post('/register', userCreator.userRegister)



module.exports = router