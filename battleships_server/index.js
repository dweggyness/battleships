
const express = require('express');

const app = express();
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

exports.io = io;
const { setRoutes } = require('./src/routes');

const port = process.env.PORT || 5000;

async function startServer() {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    await setRoutes(app);

    app.use(express.static(path.resolve(__dirname, '../battleships_client/build')));

    app.get('*', (request, response) => {
        response.sendFile(path.resolve(__dirname, '../battleships_client/build', 'index.html'));
    });

    http.listen(port, () => console.log(`Server started at port ${port}`));
}

startServer();
