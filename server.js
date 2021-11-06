const app = require('./app');
const sessionMiddleware = require('./app')
const port = process.env.EXPRESS_PORT;

const webSocket = require('./soket');


const server = app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});

webSocket(server, app, sessionMiddleware)