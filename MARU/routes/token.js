const express = require('express');
const router = express.Router();
const userJwt = require('../modules/middlewares');

router.get('/request', userJwt.refreshToken);


module.exports = router;