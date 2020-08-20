var express = require('express');
var router = express.Router();

router.use('/search', require('./search'));
router.use('/user', require('./user'));
module.exports = router;
