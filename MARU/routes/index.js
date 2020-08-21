const express = require('express');
const router = express.Router();

router.use('/search', require('./search'));
router.use('/user', require('./user'));
<<<<<<< HEAD
//router.use('/chat', require('./chat'));
=======
router.use('/room', require('./room'));
>>>>>>> 1ebe36ae8023a394f0f39e2e48492460db6de3f6

module.exports = router;
