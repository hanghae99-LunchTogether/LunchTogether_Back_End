const { users } = require('../models');
const jwt = require('jsonwebtoken');
module.exports = async (req, res, next) => {
  try {
    const location = 'Authorization';
    console.log(req.headers);
    const authorization = req.headers[location];
    const [tokenType, token] = authorization.split(' ')

    if (tokenType !== "Bearer"){
      res.status(401).send({
        errorMessage: "로그인이 필요합니다."
      });
      return;
    }
    if (token) {
      //
      const { email } = jwt.verify(token, process.env.SECRET_KEY);
      //async 함수가 아니므로 await 사용못함 .then활용!
      await users.findOne({ where: { email } }).then((user) => {
        //locals는 마음대로 쓸 수 있는 저장공간
        res.locals.user = user;
      });
    } else {
      res.locals.user = undefined;
      console.log('토큰 없습니다.');
      console.log('로컬 유저는?', res.locals.user);
    }
    next();
    //토큰 검증
  } catch (error) {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요.',
    });
    return;
  }
};
