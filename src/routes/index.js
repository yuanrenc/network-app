const express = require('express');
const authRouter = require('./auth');
const postRouter = require('./post');
const profileRouter = require('./profile');
const userRouter = require('./user');

const router = express.Router();
// router.use();

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/post', postRouter);
router.use('/profile', profileRouter);

module.exports = router;
