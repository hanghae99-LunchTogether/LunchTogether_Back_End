// const redis = require('redis');



// const redisClient = redis.createClient({
//     url: `redis://${process.env.Redisend}:${process.env.RedisPort}`,
//     password: process.env.Redispassword
// });



// redisClient.auth(process.env.Redispassword,function (err) {

//     if (err) throw err;

// });


// redisClient.on('error', function(err) {

//     console.log('Redis error: ' + err);

// });

// redisClient.hset('users', 15544, 55555);
// redisClient.hget('users', 15544, function (err , data) {
//     console.log(data);
// })



// module.exports = redisClient;



