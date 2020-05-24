
const { setRoutes } = require('./routes');
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

exports.io = io;
const bodyParser = require('body-parser');

const port = 3000;

async function startServer() {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    await setRoutes(app);

    http.listen(port, () => console.log(`Server started at port ${port}`));
}

startServer();
