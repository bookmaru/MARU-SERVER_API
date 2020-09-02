const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const middleware = require('../modules/middlewares');

router.get('/book', searchController.kakao);
router.get('/room', searchController.room);

module.exports = router;