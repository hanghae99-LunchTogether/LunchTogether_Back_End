const passport = require('passport');
const local = require('./local');
const kakao = require('./kakaoStrategy');


module.exports = () => {
  local();
  kakao();
};