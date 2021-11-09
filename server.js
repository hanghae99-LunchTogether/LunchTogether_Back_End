const { app, sessionMiddleware } = require("./app");
const webSocket = require("./soket");
const port = process.env.EXPRESS_PORT;
("use strict");
const fs = require("fs");
const http = require("http");
const https = require("https");

// const privateKey = fs.readFileSync("/etc/letsencrypt/live/lebania.shop/privkey.pem", "utf8");
// const certificate = fs.readFileSync("/etc/letsencrypt/live/lebania.shop/cert.pem", "utf8")
// const ca = fs.readFileSync("/etc/letsencrypt/live/lebania.shop/fullchain.pem", "utf8")

// const credentials = {
//     key: privateKey,
//     cert: certificate,
//     ca: ca
// };

const httpServer = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);

// const httpServer = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
  console.log(new Date().toLocaleString());
  console.log("HTTP Server running on port 80");
});

// const server = httpsServer.listen(443, ()=>{
//     console.log((new Date()).toLocaleString());
//     console.log(`HTTPS -- listening on port 443 ...`);
// })

// webSocket(server, app, sessionMiddleware);

// webSocket(server, app, sessionMiddleware);

//혹시모를 예전 서버코드
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
