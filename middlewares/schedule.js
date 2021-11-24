const { Op } = require('sequelize');

const { lunchs, sequelize, users, lunchdata, applicant } = require("../models");

module.exports = async() =>{
    console.log('스케줄러 시작');
    try {
        const today = new Date();
        const targets = await lunchs.findAll({
            where:{
                duration: null,
                date: {[Op.lte]:today},
            }
        })
        targets.forEach( async(target) => {
            await lunchs.update(
                {
                    duration : 1
                },
                {
                    where: { lunchid: target.lunchid}
                })
        });
    } catch (error) {
        console.log(error)
    }
}