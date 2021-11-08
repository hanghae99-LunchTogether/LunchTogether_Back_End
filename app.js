const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const session = require("express-session");
const morgan = require("morgan");
const path = require("path");
const nunjucks = require("nunjucks");
const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();
const pageRouter = require("./routers/page");
const authRouter = require("./routers/auth");
const passportConfig = require("./passport");

passportConfig();
app.set("port", process.env.PORT || 3000);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

// sequelize
const { sequelize, Sequelize } = require("./models");

const cors = require("cors");
const swaggerUi = require("swagger-ui-express"); //스웨거 자동생성을 위한 코드
const swaggerFile = require("./swagger_output.json"); //스웨거 아웃풋파일 저장 위치

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
// passport 로컬,카카오로그인
app.use(passport.initialize()); // req객체에 passport설정
app.use(passport.session()); // req.session객체에 passport설정. deserializeUser 호출

app.use("/", pageRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// routers

// swagger
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = app;
