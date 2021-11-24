
const { lunchs, sequelize, users, lunchdata, applicant } = require("./models");

async function test() {
    const lunch = await lunchs.findOne({where: { private: false }});
    const test = new Date(lunch.createdAt);
    
    console.log(lunch.createdAt, test.getUTCHours())
}

test()

