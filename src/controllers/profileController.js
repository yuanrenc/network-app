const Profile = require('../models/Profile');
const User = require('../models/User');
const Joi = require('joi').extend(require('@joi/date'));

const joiSchema = Joi.object({
  status: Joi.string().required(),
  skills: Joi.required()
});

const experienceSchema = Joi.object({
  title: Joi.string().required(),
  company: Joi.string().required(),
  from: Joi.date().format('MM/YYYY').required()
});

const getUserProfile = async (req, res, next) => {
  try {
    // console.log(req.userId);
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

const getAllProfile = async (req, res, next) => {
  try {
    const profile = await Profile.find().populate('user', [
      'username',
      'avatar'
    ]);
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(400).send('Server Error;');
  }
};

const getProfileById = async (req, res, next) => {
  try {
    console.log(req.params.userId);
    try {
      const profile = await Profile.findOne({
        user: req.params.userId
      }).populate('user', ['username', 'avatar']);
      if (!profile) {
        return res.status(404).send(`Profile not found.`);
      }
      return res.json(profile);
    } catch (error) {
      console.log(error.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).send(`Profile not found.`);
      }
      res.status(400).send('Server Error;');
    }
  } catch (error) {}
};

const deleteProfileAndUser = async (req, res, next) => {
  try {
    // @todo remove users posts;
    await Profile.findOneAndRemove({ user: req.userId });
    await User.findOneAndRemove({ _id: req.userId });
    return res.status(200).send('User deleted');
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Something wrong happened.');
  }
};

const updateExperiences = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { title, company, from, location, to, current, description } =
      await experienceSchema.validateAsync(req.body, { allowUnknown: true });
    const profile = await Profile.findOne({ user: req.userId });
    const newExp = {
      title,
      company,
      from,
      location,
      to,
      current,
      description
    };
    profile.experience.unshift(newExp);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    return res.status(400).json(error.message);
  }
};

module.exports = {
  getUserProfile,
  createProfile,
  getAllProfile,
  getProfileById,
  deleteProfileAndUser,
  updateExperiences
};
