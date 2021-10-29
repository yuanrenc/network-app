const Post = require('../models/post');
const User = require('../models/user');
const Profile = require('../models/profile');
const Joi = require('joi');

const doPost = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || text === '') return res.status(2400).json('Text is required.');
    const user = await User.findById(req.userId).select('-password');
    const newPost = new Post({
      text,
      name: user.username,
      avatar: user.avatar,
      user: user.id
    });
    const post = await newPost.save();
    return res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Server Error');
  }
};

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json('Server Error');
  }
};

const getPostsById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json('Post not find.');
    return res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json('Server Error');
  }
};

const deletePostById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json('Post not find.');
    if (post.user.toString() !== req.userId) {
      return res.status(403).json('User not Authorized.');
    } else {
      await post.remove();
      return res.status(200).json('post deleted');
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json('Server Error');
  }
};

const likeAPost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json('Post not find.');
    if (
      post.likes.filter((like) => like.user.toString() === req.userId).length >
      0
    ) {
      return res.status(403).json('Post already liked.');
    } else {
      post.likes.unshift({ user: req.userId });
      await post.save();
      return res.status(200).json(post);
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json('Server Error');
  }
};
const unlikeAPost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json('Post not find.');
    if (
      post.likes.filter((like) => like.user.toString() === req.userId)
        .length === 0
    ) {
      return res.status(403).json('You did not like this post.');
    } else {
      post.likes = post.likes.filter(
        (like) => like.user.toString() !== req.userId
      );
      await post.save();
      return res.status(200).json(post);
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json('Server Error');
  }
};
module.exports = {
  doPost,
  getPosts,
  getPostsById,
  deletePostById,
  likeAPost,
  unlikeAPost
};
