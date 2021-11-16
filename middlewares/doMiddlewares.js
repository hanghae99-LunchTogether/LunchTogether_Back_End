const { users , sequelize} = require('../models');
const jwt = require('jsonwebtoken');
const { logger } = require("../config/logger"); //로그
module.exports = async (req, res, next) => {
  try {
    const location = 'authorization';
    const authorization = req.headers[location];
    console.log(authorization);
    if(!authorization){
      res.locals.user = undefined;
      next();
      return;
    }
    const [tokenType, token] = authorization.split(' ')
    if (tokenType !== "Bearer"){
      logger.error('/middleware 토큰타입 오류!');
      res.status(401).send({ result: "fail", msg: "비정상 접근 헤더확인 요망" });
      return;
    }
    if(token == 'null'){
      res.locals.user = undefined;
      next();
      return;
    }
    if (token) {
      const { id } = jwt.verify(token, process.env.SECRET_KEY);
      const query = "select * from users LEFT join bookmarks on users.userid = bookmarks.userid where users.userid = :userid;";
      console.log(id);
      const users = await sequelize.query(query, {
        replacements: {
          userid: id,
        },
        type: sequelize.QueryTypes.SELECT,
      });
      let userbookmark = []
      for(a of users){
        userbookmark.push(a.lunchid);
      }
      if(!users.length){
        logger.error('/middleware 토큰 변조됨');
        res.status(401).send({ result: "fail", msg: "해당토큰이 변조됨 다시발급요망" }); 
        return ; 
      }
      const user = {
        userid: users[0]['userid'],
        email: users[0]['email'],
        nickname: users[0]['nickname'],
        book: userbookmark
      };
      console.log(user)
      res.locals.user = user;
      console.log('로컬 유저는?', res.locals.user.nickname);
    } else {
      res.locals.user = undefined;
      // logger.error('/middleware 토큰 없음');
      // res.status(401).send({ result: "fail", msg: "토큰이 없음. 토큰재발급 요망 " });
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
