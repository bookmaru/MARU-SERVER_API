const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/popular', mainController.mainView1);
router.get('/new', mainController.mainView2);

module.exports = router;