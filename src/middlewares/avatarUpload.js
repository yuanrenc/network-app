const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');

const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image')) {
    cb(new Error("It's not a valid image."), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: multerFilter
});

const uploadAvatar = (req, res, next) => {
  var handler = upload.single('avatar');
  handler(req, res, function (err) {
    if (err) {
      console.log(err.message);
      return res.status(400).json('Please upload an image');
    }
    next();
  });
};

const resizeUserAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.buffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpg')
    .jpeg({ quality: 90 })
    .toBuffer();
  return next();
});

module.exports = { uploadAvatar, resizeUserAvatar };
