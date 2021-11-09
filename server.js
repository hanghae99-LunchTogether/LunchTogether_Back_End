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

const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const HTTP_PORT = 8080;
const HTTPS_PORT = 8443;
const options = {
  ca: fs.readFileSync("/etc/letsencrypt/live/lebania.shop/fullchain.pem"),
  key: fs.readFileSync("/etc/letsencrypt/live/lebania.shop/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/lebania.shop/cert.pem"),
};
const app = express(); // Default route for server status
app.get("/", (req, res) => {
  res.json({
    message: `Server is running on port ${req.secure ? HTTPS_PORT : HTTP_PORT}`,
  });
}); 
// Create an HTTP server. 
http.createServer(app).listen(HTTP_PORT); 
// Create an HTTPS server. 
https.createServer(options, app).listen(HTTPS_PORT);
