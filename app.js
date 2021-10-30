const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const cors = require('cors');
const swaggerUi = require('swagger-ui-express'); //스웨거 자동생성을 위한 코드
const swaggerFile = require('./swagger_output.json'); //스웨거 아웃풋파일 저장 위치

app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const Router = require("./routers");
app.use("/", [Router]);

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = app;
