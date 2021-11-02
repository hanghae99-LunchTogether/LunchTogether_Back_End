const passprot = require('passport');
const { users, sequelize } = require("../models");
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');


module.exports = () =>{
    passprot.serializeUser((user, done) =>{
        done(null, user.userid)
    });
    
    passprot.deserializeUser((id, done) =>{
        users.findOne({where : {userid : id}})
        .then( user => done(null , user))
        .catch(err => done(err));
    });
    
    local();
    kakao();
};