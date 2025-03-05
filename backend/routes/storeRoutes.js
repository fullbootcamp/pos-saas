const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const storeController = require('../controllers/storeController');

router.post('/', authenticate, storeController.createStore);

module.exports = router;