const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/book', searchController.kakao);


module.exports = router;