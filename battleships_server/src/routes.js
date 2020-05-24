
const { Game } = require('./services/Game');
const { io } = require('./app');
const ongoingGamesCache = require('./cache/cache');
// TODO : begin using node-cache

exports.setRoutes = async (app) => {
    io.on('connection', (socket) => {
        console.log('Connected!');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on('chat message', (msg) => {
            console.log('Received: ', msg);
            socket.broadcast.emit('chat message', msg);
        });

        socket.on('attackPos' ({ clientID, attackPos }) => {
            // TODO : From clientID, find the game that the user is in, and if they're p1 or p2
            console.log('wahc');
        }

        socket.on('startGame', ({ gameID, shipCoords }) => {
            const existingGameInstance = ongoingGamesCache.get(gameID);
            if (existingGameInstance) {
                const { game } = existingGameInstance;
                game.player2SetupShips(shipCoords);
                socket.join(gameID);
                console.log('Existing game found');
                const gameObject = {
                    ...game,
                    player2Socket: socket,
                };
                console.log(ongoingGamesCache.update(gameID, gameObject));
            } else {
                console.log('New game made at ', gameID);
                const game = new Game(gameID);
                game.player1SetupShips(shipCoords);
                const gameObject = {
                    game,
                    player1Socket: socket,
                };
                socket.join(gameID);
                ongoingGamesCache.update(gameID, gameObject);
            }
        });
    });

    app.get('/', (req, res) => {
        res.sendFile(`${__dirname}/index.html`);
    });
    return app;
};

// app.post('/startGame/:id', (req, res) => {
//     const id = req.params.id || 1;
//     // TODO Only create new game instance if tehre isn't already one
//     const gameInstance = new Game(id);
//     // If game instance available, attempt to join it as player2
//     // TODO Return authentication token?

//     const cacheObject = {
//         [id]: gameInstance,
//     };
//     cache.set('games', cacheObject);
//     console.log(cache.get('games'));
//     // const clients = cache.get('clientID');
//     // When client closes connection we update the clients list
//     // avoiding the disconnected one
//     req.on('close', () => {
//         console.log(' Connection closed');
//     });
// });

/* socket.emit('startGame', { gameID: 1, shipCoords: {
patrol: [[1,1],[1,2]], destroyer: [[1,3],[1,4],[1,5]],
submarine: [[5,3],[4,3],[4,4]], battleship: [[3,3],[4,4],[5,5],[3,3]],
carrier: [[3,3],[4,4],[5,5],[3,3],[4,4]]
}});
*/