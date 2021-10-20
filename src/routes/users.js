const express = require('express');
const logger = require('../utils/logger');
const Joi = require('joi');
const catchAsync = require('../utils/catchAsync');
const gravatar = require('gravatar');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

const router = express.Router();

const schema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().required(),
  email: Joi.string().email().required()
});

router.post('/', async (req, res, next) => {
  try {
    const { username, email, password } = await schema.validateAsync(req.body, {
      allowUnknown: true,
      stripUnknown: true
    });
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json('User already exists.');
    }
    const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
    hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      username,
      email,
      avatar,
      password: hashedPassword
    });

    if (user) {
      await user.save();
      const payload = { userId: user.id };
      console.log(payload);
      const token = jwt.sign(payload, process.env.SECRETE, {
        expiresIn: '1d'
      });
      return res.status(200).json(`Registered succeeded! username:${username},
      email:${email},token:${token}`);
    }
  } catch (error) {
    logger.error(error);
    res.status(400).json(error.message);
  }
});

module.exports = router;
