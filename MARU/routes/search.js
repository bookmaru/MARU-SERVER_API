const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/book', searchController.kakao);
router.get('/room', searchController.room);

module.exports = router;