const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getUserProfile,
  createProfile
} = require('../controllers/profileController');

router.get('/me', auth, getUserProfile);
router.post('/', auth, createProfile);

module.exports = router;
