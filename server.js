const {app, sessionMiddleware} = require('./app');
const port = process.env.EXPRESS_PORT;
const webSocket = require('./soket');


const https = require('https')
const fs = require('fs')

const options = { 
    key: fs.readFileSync('./rootca.key'), 
    cert: fs.readFileSync('./rootca.crt') 
  };
  


// https.createServer(options, (req, res) => {
//     res.writeHead(200);
//     res.end('hello world\n');
// }).listen(8000);

https.createServer(options, app).listen(3000, function() {
    console.log("HTTPS server listening on port " + 3000);
});


// const server = app.listen(port, () => {
//     console.log(`listening at http://localhost:${port}`);
// });

// webSocket(server, app, sessionMiddleware)