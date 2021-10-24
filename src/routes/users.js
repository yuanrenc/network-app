const express = require('express');
const Joi = require('joi');
const s3 = require('../utils/s3');
const {
  resizeUserAvatar,
  uploadAvatar
} = require('../middlewares/avatarUpload');
const auth = require('../middlewares/auth');
const { updateUser, uploadAvatarById } = require('../controllers/user');

const router = express.Router();

router.post('/', updateUser);
router.post('/avatar', auth, uploadAvatar, resizeUserAvatar, uploadAvatarById);

module.exports = router;
