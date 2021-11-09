const { app, sessionMiddleware } = require("./app");
const port = process.env.EXPRESS_PORT;
const webSocket = require("./soket");
const http =require('http');
const https = require('https')

const options = {
  // letsencrypt로 받은 인증서 경로를 입력
  ca: fs.readFileSync("/etc/letsencrypt/live/lebania.shop/fullchain.pem"),
  key: fs.readFileSync("/etc/letsencrypt/live/lebania.shop/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/lebania.shop/cert.pem"),
};
const server = http.createServer(app).listen(3000);
const server = https.createServer(options, app).listen(443, () => {
    console.log(`listening at http://localhost:${port}`);
  });

// const server = app.listen(port, () => {
//   console.log(`listening at http://localhost:${port}`);
// });

webSocket(server, app, sessionMiddleware);
