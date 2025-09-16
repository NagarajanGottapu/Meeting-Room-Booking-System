const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Create a new user or get existing
router.post('/', userController.createUser);

// Get a user by email
router.get('/email/:email', userController.getUserByEmail);

module.exports = router;