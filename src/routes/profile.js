const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getUserProfile } = require('../controllers/profileController');

router.get('/me', auth, getUserProfile);

module.exports = router;
