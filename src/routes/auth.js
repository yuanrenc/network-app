const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const Joi = require('joi');
const joiSchema = require('../utils/joiSchema');
const catchAsync = require('../utils/catchAsync');

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
    const { username, email, password } = await joiSchema.validateAsync(
      req.body,
      {
        allowUnknown: true,
        stripUnknown: true
      }
    );
    let user = await User.findOne({ username }).exec();
    if (!user) {
      return res.status(400).json('User did not exist.');
    }
    if (user) {
      const hashedPassword = user.password;

      if (await bcrypt.compareSync(password, hashedPassword)) {
        const payload = { userId: user.id };
        // console.log(payload);
        const token = jwt.sign(payload, process.env.SECRETE, {
          expiresIn: '1d'
        });
        return res.status(200).json(`Registered succeeded! username:${username},
      email:${email},token:${token}`);
      }
    } else {
      return res.status(400).json('Username or password incorrect');
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json(error.message);
  }
});

module.exports = router;
