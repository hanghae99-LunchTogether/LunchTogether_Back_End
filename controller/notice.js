// await redisClient.hget('users', applicants.dataValues.lunch.dataValues.host.dataValues.userid, function (err , data) {
//     if(err)console.log(err)
//     console.log(data);
//     if(data){
//       req.app.get('io').of('/userin').to(data).emit('offercon', user.userid+"거절했데~!");
//     }
//   })
//   notice.create({
//     userid: applicants.dataValues.lunch.dataValues.host.dataValues.userid,
//     kind : "offercon",
//     message : user.userid+"거절했데~!",
//     nickname : user.nickname
//   })

const { notice } = require("../models");
const { logger } = require("../config/logger"); //로그
const redisClient = require("../config/redis");
require("date-utils");

noticedele = async (req, res) => {
    const user = res.locals.user;
    try {
        await notice.destroy({ where: { userid: user.userid }})
        logger.error(err);
        return res.status(200).send({
        result: "success",
        msg: "알림 모두 삭제 완료",
        });
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            result: "fail",
            msg: "알림 모두 삭제 실패",
        });
    }

}
module.exports = {
  noticedele : noticedele
};
