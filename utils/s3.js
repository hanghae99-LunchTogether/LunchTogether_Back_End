const AWS = require("aws-sdk");

var multer = require("multer");
var multerS3 = require("multer-s3");

const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const bucket = AWS.config.update({
  //보안자격증명 액세스 키 설정해야 s3 bucket 접근이 가능하다.
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: "ap-northeast-2", // 한국
});

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: process.env.bucket,
    key(req, file, cb) {
      cb(null, `original/${Date.now()}${path.basename(file.originalname)}`);
    },
    acl: "public-read-write",
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
