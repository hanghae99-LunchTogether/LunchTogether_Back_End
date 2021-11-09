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



const express = require('express');
const fs = require('fs');
const path = require('path');
const HTTPS = require('https');

const app = express();




// ca: fs.readFileSync("/etc/letsencrypt/live/lebania.shop/fullchain.pem"),
// key: fs.readFileSync("/etc/letsencrypt/live/lebania.shop/privkey.pem"),
// cert: fs.readFileSync("/etc/letsencrypt/live/lebania.shop/cert.pem"),
try {
  const option = {
    ca: fs.readFileSync('/etc/letsencrypt/live/lebania.shop/fullchain.pem'),
    key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/lebania.shop/privkey.pem'), 'utf8').toString(),
    cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/lebania.shop/cert.pem'), 'utf8').toString(),
  };

  HTTPS.createServer(option, app).listen(3000, () => {
    colorConsole.success(`[HTTPS] Soda Server is started on port ${colors.cyan(sslport)}`);
  });
} catch (error) {
  colorConsole.error('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
  colorConsole.warn(error);
}

