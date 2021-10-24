const AWS = require('aws-sdk');
const uuid = require('uuid');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key
});

module.exports = s3;
