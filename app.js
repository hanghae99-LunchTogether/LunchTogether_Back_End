const express = require("express");
const app = express();
const dotenv = require("dotenv");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const passportRouter = require("./routers/auth");
dotenv.config();

const cors = require("cors");
const swaggerUi = require("swagger-ui-express"); //스웨거 자동생성을 위한 코드
const swaggerFile = require("./swagger_output.json"); //스웨거 아웃풋파일 저장 위치

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    resave: false, // 일단 디폴트값
    saveUnitialized: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

// routers
const Router = require("./routers");
app.use("/", [Router]);

// swagger
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// sequelize
const { sequelize, Sequelize } = require("./models");

// passport 로컬,카카오로그인
app.use(passport.initialize()); // req객체에 passport설정
app.use(passport.session()); // req.session객체에 passport설정. deserializeUser 호출
app.use("/auth", passportRouter);

const driver = async () => {
  try {
    await sequelize.sync();
  } catch (err) {
    console.error("초기화 실패");
    console.error(err);
    return;
  }
  console.log("초기화 완료.");
};

// driver();

module.exports = app;
