const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware'); // Already refactored
const superadminController = require('../controllers/superadminController');

router.get('/users', authenticate, superadminController.getUsers);
router.post('/users', authenticate, superadminController.createUser);
router.get('/tasks', authenticate, superadminController.getTasks);
router.post('/tasks', authenticate, superadminController.createTask);

module.exports = router;