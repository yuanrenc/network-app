const Profile = require('../models/profile');
const Joi = require('joi');
const normalizeUrl = require('normalize-url');

const joiSchema = Joi.object({
  status: Joi.string().required(),
  skill: Joi.required()
});

const getUserProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.userId }).populate(
      'user',
      ['username', 'avatar']
    );
    if (!profile) {
      return res.status(404).json('There is no profile for this user.');
    }
    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json('Something wrong happened.');
  }
};

const createProfile = async (res, req, next) => {
  try {
    const {
      website,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      // spread the rest of the fields we don't need to check
      ...rest
    } = req.body;
    const socialFields = {
      website,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook
    };

    for (const [key, value] of Object.entries(socialFields)) {
      if (value && value.length > 0) {
        socialFields[key] = normalizeUrl(value, { forceHTTPS: true });
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json(error.message);
  }
};

module.exports = { getUserProfile, createProfile };
