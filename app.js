const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const kakaoLoginRouter = require("./routers/kakaologin.js");

const cors = require("cors");
const swaggerUi = require("swagger-ui-express"); //스웨거 자동생성을 위한 코드
const swaggerFile = require("./swagger_output.json"); //스웨거 아웃풋파일 저장 위치

app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

const Router = require("./routers");
app.use("/", [Router]);
app.use("/kakao", [kakaoLoginRouter]);

app.get("/kakao", (req, res, next) => {
  res.render("kakaologin");
});

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = app;
