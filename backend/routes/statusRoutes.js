const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware'); // To be created or refactored
const statusController = require('../controllers/statusController');

router.get('/', authenticate, statusController.getStatus);

module.exports = router;