const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const catchAsync = require('../utils/catchAsync');

const joiSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required()
});

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { email, password } = await joiSchema.validateAsync(req.body, {
      allowUnknown: true,
      stripUnknown: true
    });
    let user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(400).json('User did not exist.');
    }
    if (user) {
      const hashedPassword = user.password;
      const passwordComparedResult = await bcrypt.compareSync(
        password,
        hashedPassword
      );

      if (passwordComparedResult === false) {
        return res.status(400).json('Email or password incorrect');
      }
      const payload = { userId: user.id };
      // console.log(payload);
      const token = jwt.sign(payload, process.env.SECRETE, {
        expiresIn: '1d'
      });
      return res.status(200).json(`email:${email},token:${token}`);
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json(error.message);
  }
});

module.exports = router;
