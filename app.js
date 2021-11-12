const express = require("express");

const path = require("path"); // 소켓
const cookieParser = require("cookie-parser"); // 쿠키파서
const session = require("express-session"); //세션
const nunjucks = require("nunjucks"); // 넌적스
const morgan = require("morgan"); //모건
const ColorHash = require("color-hash").default;
const dotenv = require("dotenv");
dotenv.config();
const Router = require("./routers");
const kakaoLoginRouter = require("./routers/kakaologin.js"); //카카오 로그인 라우터
const app = express();

app.all(function (req, res, next) {
  // let protocol = req.headers['x-forwarded-proto'] || req.protocol; 
  // if (protocol == 'https') { 
  //   next(); 
  // } 
  // else {
  //   let from = `${protocol}://${req.hostname}${req.url}`; let to = `https://${req.hostname}${req.url}`; // log and redirect 
  //   console.log(`[${req.method}]: ${from} -> ${to}`); 
  //   res.redirect(to);
  // }
  if (!req.secure) {
    res.redirect("https://" + req.headers["host"] + req.url)
    console.log('리다이렉트..!')
  }
  else {
    next();
  }
})

app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
});

const cors = require("cors");
const swaggerUi = require("swagger-ui-express"); //스웨거 자동생성을 위한 코드
const swaggerFile = require("./swagger_output.json"); //스웨거 아웃풋파일 저장 위치

// const whitelist = [process.env.dododomein, process.env.melocal, process.env.testlocal];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not Allowed Origin!"));
//     }
//   },
//   credentials: true
// };

// { origin: 'https://lunchtogether-88cf5.web.app/', credentials: true }

app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/gif", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SECRET_KEY));

app.use(sessionMiddleware);
app.use((req, res, next) => {
  if (!req.session.color) {
    const colorHash = new ColorHash();
    console.log(colorHash);
    req.session.color = colorHash.hex(req.sessionID);
    console.log(req.session.color);
  }
  next();
});

app.use("/", [Router]);
app.use("/kakao", [kakaoLoginRouter]);

app.get("/kakao", (req, res, next) => {
  res.render("kakaologin");
});

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터 없는데요..?`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.static || 500);
  res.render("error");
});

// const server = app.listen(port, () => {
//     console.log(`listening at http://localhost:${port}`);
// });

module.exports = { app, sessionMiddleware };
