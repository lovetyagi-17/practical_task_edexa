const router = require('express').Router();
const Routes = require('./routes/');
router.use('/user', Routes.user)
router.use('/tip', Routes.tip)
module.exports = router;
