const ment = require('moment');
require('moment-timezone');
const { lunchs, sequelize, users, lunchdata, applicant } = require("./models");


async function test() {
    // ment.tz.setDefault("Asia/Seoul");"2021-11-25T08:57:29.000Z"
    const lunch = await lunchs.findOne({where: {lunchid : 76}});
    const test = ment();
    console.log(ment().utc())
    console.log(test)
    const doit = new Date(test);
    console.log(new Date())
    console.log(doit);
    // console.log(doit.getUTCMonth()+1)
    // console.log(doit.getUTCFullYear())
    console.log(test.format('YYYY-MM-DD HH:mm:ss'));
}

test()

