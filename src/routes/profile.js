const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getUserProfile,
  createProfile,
  getAllProfile,
  getProfileById,
  deleteProfileAndUser,
  updateExperiences,
  deleteExperience,
  updateEducation,
  deleteEducation
} = require('../controllers/profileController');

router.get('/', auth, getAllProfile);
router.delete('/', auth, deleteProfileAndUser);
router.get('/me', auth, getUserProfile);
router.put('/experience/', auth, updateExperiences);
router.put('/education/', auth, updateEducation);
router.get('/:userId', auth, getProfileById);
router.delete('/experience/:expId', auth, deleteExperience);
router.delete('/education/:eduId', auth, deleteEducation);
router.post('/', auth, createProfile);

module.exports = router;
