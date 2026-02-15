const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  registerForEvent,
  cancelRegistration,
  getLocations,
  getCategories
} = require('../controllers/eventController');
const { protect, optionalAuth } = require('../middleware/auth');

// Public routes (with optional auth for registration status)
router.get('/', optionalAuth, getEvents);
router.get('/meta/locations', getLocations);
router.get('/meta/categories', getCategories);
router.get('/:id', optionalAuth, getEventById);

// Protected routes
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, cancelRegistration);

module.exports = router;