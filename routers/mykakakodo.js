const express = require('express');
const router = express.Router();
const api_key = process.env.kakaoApiKey;
const request = require("request");
const passport = require('../passport');


router.post('/login', (req, res, next) =>{
    passport.authenticate('local', (authError, user, info) =>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return res.send({ result: "fail", msg: info.message })
        }
        return req.login(user, (loginError) =>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.send({
                result: "success",
                msg: "로그인 완료.",
              })
        })
    })(req, res, next);
})

router.get('/logout', (req, res) =>{
    req.logOut();
    req.session.destroy();
    res.send({msg: "완료"});
})




module.exports = router;
