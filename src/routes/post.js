const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  doPost,
  getPosts,
  getPostsById,
  deletePostById,
  likeAPost,
  unlikeAPost
} = require('../controllers/postController');

router.post('/', auth, doPost);
router.get('/', auth, getPosts);
router.get('/:id', auth, getPostsById);
router.delete('/:id', auth, deletePostById);
router.put('/like/:id', auth, likeAPost);
router.put('/unlike/:id', auth, unlikeAPost);
module.exports = router;
