const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { config } = require('../config/env');
const path = require('path');
const aws = require('aws-sdk')
const multerS3 = require('multer-s3');

const multer = require('multer');

const jwtToken = async function(body) {
    const token = jwt.sign(body, config.jwtSecretKey, { expiresIn: '1w' });
    return token;
};

const bcryptfun = async(password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

const generateRandomString = (length) => Math.random().toString(36).slice(-length);
const generateRandomNumber = (_) => Math.floor(1000 + Math.random() * 9000);

const referralCode = function(length) {
    const random = `${generateRandomString(length)}-${generateRandomNumber()}`;
    return random;
};


const pagination = function(start, end, sortBy) {
    let first = Number(start) ? Number(start) : 0;
    let last = Number(end) ? (Number(end) >= 100 ? 100 : Number(end)) : 100;
    let sort = sortBy ? sortBy : 'createdAt';
    return { first, last, sort };
};
var s3 = new aws.S3({
    Bucket: config.s3.bucket,
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
})

var uploadImagesS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.s3.bucket,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        serverSideEncryption: 'AES256',
        key: function(req, file, cb) {
            cb(null, file.fieldname + '-' + file.originalname + Math.floor(100000 + Math.random() * 900000) + path.extname(file.originalname));
        }
    })
})

module.exports = {
    jwtToken,
    bcryptfun,
    referralCode,
    pagination,
    uploadImagesS3,
};