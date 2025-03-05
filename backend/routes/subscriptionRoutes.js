const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const subscriptionController = require('../controllers/subscriptionController');

router.post('/', authenticate, subscriptionController.selectPlan);
router.post('/update-subscription-end', authenticate, subscriptionController.updateSubscriptionEnd);

module.exports = router;