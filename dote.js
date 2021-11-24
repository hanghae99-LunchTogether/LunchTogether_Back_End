
const { lunchs, sequelize, users, lunchdata, applicant } = require("./models");


async function test() {
    const lunch = await lunchs.findOne({where: { private: false }});
    const test = new Date(lunch.date);
    
    console.log(lunch.date, test.getUTCHours())
    console.log(test.setDate(test.getUTCDate()+1))
    
    console.log(new Date(test))
}

test()

