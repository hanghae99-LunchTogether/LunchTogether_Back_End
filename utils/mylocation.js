const { lunchdata , sequelize} = require('../models')


Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};



function radiusxy(standardx, standardy , tagetx, tagety) {
    const a = (6371*Math.acos(Math.cos(Math.radians(standardy))*Math.cos(Math.radians(tagety))*Math.cos(Math.radians(tagetx)-Math.radians(standardx))+Math.sin(Math.radians(standardy))*Math.sin(Math.radians(tagety))))
    return a;
}

const tx = 126.571962902672;
const ty = 33.4545839507193;
console.log(radiusxy(126.571962902672, 33.4545839507193, 126.572470555321 ,33.4545893987906))


// const lunch = lunchdata.findAll({
//     where: { },
// });
// console.log(lunch)


lunchdata.findAll({
attributes: ['id',
    [
    sequelize.fn('ST_Distance',
        sequelize.fn('POINT', sequelize.col('y'), sequelize.col('x')), sequelize.fn('POINT', ty, tx)),
    'distance'
    ],
],
}).then(async (store) =>{console.log(store)})





