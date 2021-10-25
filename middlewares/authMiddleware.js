const { users , sequelize} = require('../models');
const jwt = require('jsonwebtoken');
const { logger } = require("../config/logger"); //로그
module.exports = async (req, res, next) => {
  try {
    const location = 'authorization';
    const authorization = req.headers[location];
    const [tokenType, token] = authorization.split(' ')
    
    if (tokenType !== "Bearer"){
      logger.error('/middleware 비정상 토큰');
      res.status(401).send({ result: "fail", msg: "비정상 접근 헤더확인 요망" });
      return;
    }
    if (token) {
      const { name } = jwt.verify(token, process.env.SECRET_KEY);
      const query = "select * from users where email = :email";
      const users = await sequelize.query(query, {
        replacements: {
          email: name,
        },
        type: sequelize.QueryTypes.SELECT,
      });
      const user = {
        userId: users[0]['userId'],
        email: users[0]['email'],
        nickname: users[0]['nickName'],
      };
      res.locals.user = user;
      console.log('로컬 유저는?', res.locals.user);
    } else {
      res.locals.user = undefined;
      logger.error('/middleware 비정상 토큰');
      res.status(401).send({ result: "fail", msg: "토큰이 변조되었음. 토큰재발급 요망 " });
      return;
    }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') { 
      logger.error('/middleware 토큰 만료시간끝');
      res.status(401).send({ result: "fail", msg: "토큰 만료시간이 다됬습니다. 다시 로그인 부탁드립니다." }); 
      return ; 
    }else{
      logger.error('/middleware 비정상 토큰');
      console.log(error)
      res.status(401).send({ result: "fail", msg: "비정상적 토큰" });
      return;
    }
  }
};
