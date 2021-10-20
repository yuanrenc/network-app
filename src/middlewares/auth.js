const jwt = require('jsonwebtoken');
// require('dotenv').config();

module.exports = async (req, res, next) => {
  let token = req.header('Authorization');
  if (!token) {
    return res.status(400).json('Please login first!');
  }
  try {
    token = token.split(' ')[1];
    // console.log(token);
    const decode = jwt.verify(token, process.env.SECRETE);
    req.userId = decode.userId;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json('Token is not valid');
  }
};
