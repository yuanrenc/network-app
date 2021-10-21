const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getUserProfile,
  createProfile,
  getAllProfile,
  getProfileById
} = require('../controllers/profileController');

router.get('/', auth, getAllProfile);
router.get('/me', auth, getUserProfile);
router.get('/:id', auth, getProfileById);
router.post('/', auth, createProfile);

module.exports = router;
