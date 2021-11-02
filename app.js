const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');


const cors = require('cors');
const swaggerUi = require('swagger-ui-express'); //스웨거 자동생성을 위한 코드
const swaggerFile = require('./swagger_output.json'); //스웨거 아웃풋파일 저장 위치

app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser(process.env.SECRET_KEY));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret : process.env.SECRET_KEY,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));


const Router = require("./routers");
app.use("/", [Router]);

app.use((req, res, next)=> {
    const error = new Error(`${req.method} ${req.url} 없는데요..?`);
    error.status = 404;
    next(error);
})
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));


app.use((err, req, res, next) =>{
    res.locals.message = err.message;
    res.status(err.status || 500).send('error');
})

module.exports = app;
