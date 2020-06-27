
const { UserGameService } = require('./services/UserGameService');
const { io } = require('..');
// TODO : begin using node-cache

exports.setRoutes = async (app) => {
    io.on('connection', (socket) => {
        const clientID = socket.id;
        const GameHandler = new UserGameService(socket);

        socket.on('disconnect', () => {
            GameHandler.handleDisconnect(clientID);
        });

        socket.on('attackPos', ({ attackPos }) => {
            try {
                GameHandler.attackPos(attackPos);
                GameHandler.checkForPlayerVictory();
            } catch (e) {
                GameHandler.handleError(e.message);
            }
        });

        socket.on('startGame', ({ gameID, shipCoords }) => {
            try {
                GameHandler.setupGameInstance(gameID, shipCoords);
                if (GameHandler.isGameInstanceReady()) {
                    GameHandler.startGame();
                }
            } catch (e) {
                GameHandler.handleError(e.message);
            }
        });

        socket.on('playAgain', () => {
            try {
                GameHandler.handlePlayAgain();
            } catch (e) {
                GameHandler.handleError(e.message);
            }
        });
    });

    return app;
};
