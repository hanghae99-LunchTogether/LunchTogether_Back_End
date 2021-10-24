const app = require('./app');
const port = process.env.EXPRESS_PORT;



app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});
  