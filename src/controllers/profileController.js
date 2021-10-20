const Profile = require('../models/profile');
const Joi = require('joi');

const joiSchema = Joi.object({
  status: Joi.string().required(),
  skills: Joi.required()
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

const createProfile = async (req, res, next) => {
  try {
    if (!req.body) return res.status(404).json('Please enter your profile');
    const {
      skills,
      website,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      // spread the rest of the fields we don't need to check
      ...rest
    } = await joiSchema.validateAsync(req.body, { allowUnknown: true });
    const socialFields = {
      website,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook
    };

    // console.log(skills);
    const skillsArray = skills.split(',').map((skill) => skill.trim());
    // console.log(skillsArray);
    const profileFields = {
      user: req.userId,
      skills: skillsArray,
      ...rest
    };

    profileFields.social = socialFields;
    let profile = await Profile.findOneAndUpdate(
      { user: req.userId },
      { $set: profileFields },
      { new: true, upsert: true }
    );
    return res.status(200).json(profile);
  } catch (error) {
    console.log(error.message);
    return res.status(400).json(error.message);
  }
};

module.exports = { getUserProfile, createProfile };
