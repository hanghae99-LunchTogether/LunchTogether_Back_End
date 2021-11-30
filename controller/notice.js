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