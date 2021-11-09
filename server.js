// const { app, sessionMiddleware } = require("./app");
// const port = process.env.EXPRESS_PORT;
// const webSocket = require("./soket");
// const http =require('http');
// const https = require('https')
// const fs = require('fs')

// const options = {
//   // letsencrypt로 받은 인증서 경로를 입력
//   ca: fs.readFileSync("/etc/letsencrypt/live/lebania.shop/fullchain.pem"),
//   key: fs.readFileSync("/etc/letsencrypt/live/lebania.shop/privkey.pem"),
//   cert: fs.readFileSync("/etc/letsencrypt/live/lebania.shop/cert.pem"),
// };
// console.log(options);
// // http.createServer(app).listen(3000);
// https.createServer(options, app).listen(443, () => {
//     console.log(`listening at http://localhost:${port}`);
//   });

// const server = app.listen(port, () => {
//   console.log(`listening at http://localhost:${port}`);
// });

// webSocket(server, app, sessionMiddleware);

// const express = require("express");
// const http = require("http");
// const https = require("https");
// const fs = require("fs");
// // const HTTP_PORT = 3000;
// const HTTPS_PORT = 3000;
// const options = {
//   ca: fs.readFileSync("/etc/letsencrypt/live/lebania.shop/fullchain.pem"),
//   key: fs.readFileSync("/etc/letsencrypt/live/lebania.shop/privkey.pem"),
//   cert: fs.readFileSync("/etc/letsencrypt/live/lebania.shop/cert.pem"),
// };
// const app = express(); // Default route for server status
// app.get("/", (req, res) => {
//   res.json({
//     message: `Server is running on port ${req.secure ? HTTPS_PORT : HTTP_PORT}`,
//   });
// }); 
// // Create an HTTP server. 
// // http.createServer(app).listen(HTTP_PORT); 
// // Create an HTTPS server. 
// https.createServer(options, app).listen(HTTPS_PORT);




//   ca: fs.readFileSync("/etc/letsencrypt/live/lebania.shop/fullchain.pem"),
//   key: fs.readFileSync("/etc/letsencrypt/live/lebania.shop/privkey.pem"),
//   cert: fs.readFileSync("/etc/letsencrypt/live/lebania.shop/cert.pem"),
'use strict';
const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");

const app = express();  // https
const app2 = express();  // http

// yourdomain.com 은 실제로 사용중인 도메인으로 바꿔야함. -- Let's Encrypt 인증서 설치시 위치 사용.
const privateKey = fs.readFileSync("/etc/letsencrypt/live/lebania.shop/privkey.pem", "utf8");
const certificate = fs.readFileSync("/etc/letsencrypt/live/lebania.shop/cert.pem", "utf8")
const ca = fs.readFileSync("/etc/letsencrypt/live/lebania.shop/fullchain.pem", "utf8")

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

const httpServer = http.createServer(app2);
const httpsServer = https.createServer(credentials, app);

// 80 port -- http
app2.get("/", (req, res) => {
    console.log("------ http get / -----" + (new Date()).toLocaleString());
    console.log("req.ip => " + req.ip);
    console.log("req.hostname => " + req.hostname);
    console.log(req.url);
    console.log(req.originalUrl);

    res.send("<h1>HTTP Server running on port 80</h1>");
})

// 3000 port -- https
app.get("/", (req, res) => {
    console.log("------ https get / -----" + (new Date()).toLocaleString());
    console.log("req.ip => " + req.ip);
    console.log("req.hostname => " + req.hostname);
    console.log(req.url);
    console.log(req.originalUrl);

    res.send("<h1>HTTPS Server running on port 3000</h1>");
})


httpServer.listen(80, () => {
    console.log((new Date()).toLocaleString());
    console.log('HTTP Server running on port 80');
})

httpsServer.listen(3000, ()=>{
    console.log((new Date()).toLocaleString());
    console.log(`HTTPS -- listening on port 3000 ...`);
})

