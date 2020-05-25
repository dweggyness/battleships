
const { uuid } = require('uuidv4');
const { Game } = require('./services/Game');
const { io } = require('./app');
const { ongoingGamesCache, clientsCache } = require('./cache/cache');
// TODO : begin using node-cache

exports.setRoutes = async (app) => {
    io.on('connection', (socket) => {
        const clientID = uuid();
        console.log('Connected!: ', clientID);
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on('attackPos', ({ client, attackPos }) => {
            console.log('crack : ', clientsCache.get(client));
            const { gameID: curGameID } = clientsCache.get(client);
            console.log('Attack Pos, client: ', client, ' ', curGameID);
            const { game } = ongoingGamesCache.get(curGameID);

            let result = '';
            const playerType = game.getPlayerType(clientID);
            if (playerType === 1) {
                result = game.player1AttackPos(attackPos);
            } else if (playerType === 2) {
                result = game.player2AttackPos(attackPos);
            }
            
            console.log(typeof result, result);
            io.in(curGameID).emit('attackAttempt', { player: playerType, attackPos, result });
        });

        socket.on('startGame', ({ gameID, shipCoords }) => {
            const existingGameInstance = ongoingGamesCache.get(gameID);
            if (existingGameInstance) {
                socket.join(gameID);
                const { game } = existingGameInstance;

                game.player2SetupShips(shipCoords);
                game.player2 = clientID;
                const gameObject = {
                    game,
                };
                ongoingGamesCache.update(gameID, gameObject);
            } else {
                socket.join(gameID);
                const game = new Game(gameID);

                game.player1 = clientID;
                game.player1SetupShips(shipCoords);
                const gameObject = {
                    game,
                };
                ongoingGamesCache.update(gameID, gameObject);
            }

            const clientObject = {
                gameID,
            };
            clientsCache.update(clientID, clientObject);

            console.log(clientsCache.get(clientID));
            console.log(ongoingGamesCache.get(gameID));
            socket.emit('message', { client: clientID, playerType: 1 });
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