const express = require('express');
const router = express.Router();

router.use('/search', require('./search'));
router.use('/user', require('./user'));
//router.use('/chat', require('./chat'));

module.exports = router;
