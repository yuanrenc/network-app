const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getUserProfile,
  createProfile,
  getAllProfile,
  getProfileById,
  deleteProfileAndUser,
  updateExperiences
} = require('../controllers/profileController');

router.get('/', auth, getAllProfile);
router.delete('/', auth, deleteProfileAndUser);
router.get('/me', auth, getUserProfile);
router.put('/experience', auth, updateExperiences);
// router.get('/:userId', auth, getProfileById);
router.post('/', auth, createProfile);
router.route('/:userId').get(auth, getProfileById);

module.exports = router;
