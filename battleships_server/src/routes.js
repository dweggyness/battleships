
const { GameService } = require('./services');
const { io } = require('./app');
// TODO : begin using node-cache

exports.setRoutes = async (app) => {
    io.on('connection', (socket) => {
        const clientID = socket.id;
        const GameHandler = new GameService(io, socket);
        console.log('Connected!: ', clientID);

        socket.on('disconnect', () => {
            GameHandler.handleDisconnect(clientID);
        });

        socket.on('attackPos', ({ attackPos }) => {
            try {
                GameHandler.attackPos(attackPos);
            } catch (e) {
                GameHandler.handleError(e);
            }
        });

        socket.on('startGame', ({ gameID, shipCoords }) => {
            try {
                GameHandler.setupGame(gameID, shipCoords);
            } catch (e) {
                GameHandler.handleError(e);
            }
        });
    });

    app.get('/', (req, res) => {
        res.sendFile(`${__dirname}/index.html`);
    });
    return app;
};

/* socket.emit('startGame', { gameID: 1, shipCoords: {
patrol: [[1,1],[1,2]], destroyer: [[1,3],[1,4],[1,5]],
submarine: [[5,3],[4,3],[4,4]], battleship: [[3,3],[4,4],[5,5],[3,3]],
carrier: [[3,3],[4,4],[5,5],[3,3],[4,4]]
}});
*/

/*
socket.emit('attackPos', { client: , attackPos: [7,7] })
*/
