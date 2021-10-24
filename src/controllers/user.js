const Joi = require('joi');
const catchAsync = require('../utils/catchAsync');
const gravatar = require('gravatar');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const s3 = require('../utils/s3');

const schema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().required(),
  email: Joi.string().email().required()
});

const updateUser = async (req, res, next) => {
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
    console.log(error.message);
    res.status(400).json(error.message);
  }
};

const uploadAvatarById = async (req, res, next) => {
  const params = {
    Bucket: 'networkavatar-colin-v1',
    Key: `${req.userId}.jpg`,
    Body: req.file.buffer
  };
  let data = await s3.upload(params).promise();
  const { Location } = data;
  console.log(`File Upload Success:${Location}`);
  let user = await User.findOneAndUpdate(
    { _id: req.userId },
    { avatar: Location },
    { new: true, upsert: true }
  );

  return res.status(200).json(user);
};

module.exports = { updateUser, uploadAvatarById };
