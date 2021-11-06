const express = require("express");

const path = require('path'); // 소켓
const cookieParser = require('cookie-parser');// 쿠키파서
const session = require('express-session'); //세션
const nunjucks = require('nunjucks')// 넌적스
const morgan = require('morgan'); //모건

const app = express();
const dotenv = require("dotenv");
dotenv.config();


const kakaoLoginRouter = require("./routers/kakaologin.js"); //카카오 로그인 라우터

const cors = require("cors");
const swaggerUi = require("swagger-ui-express"); //스웨거 자동생성을 위한 코드
const swaggerFile = require("./swagger_output.json"); //스웨거 아웃풋파일 저장 위치

app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true
})

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'public')));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.SECRET_KEY));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SECRET_KEY,
  cookie:{
    httpOnly: true,
    secure: false
  }
}))

const Router = require("./routers");
app.use("/", [Router]);
app.use("/kakao", [kakaoLoginRouter]);

app.get("/kakao", (req, res, next) => {
  res.render("kakaologin");
});

app.use((req,res,next)=>{
  const error = new Error(`${req.method} ${req.url} 라우터 없는데요..?`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next)=>{
  res.locals.message =err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err: {};
  res.status(err.static || 500);
  res.render('error');
})


app.use((req,res,next)=>{
  if(!req.session.color){
    const colorHash = new ColorHash();
    req.session.color = colorHash.hex(req.sessionID);
  }
  next();
})






app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = app;
