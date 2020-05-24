
const { Game } = require('./services/Game')
const { io } = require('./app')
const cache = require('./cache/cache')
// TODO : begin using node-cache

exports.setRoutes = async (app) => {

    io.on('connection', (socket) => {
        console.log("DUMB FUCKS")
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
        });

        setTimeout(() => socket.emit('chat message', 'hi'), 100);
    })

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });

    app.post('/attackPos', (req, res) => {
        console.log(cache.get('gameID')[req.body.gameID].joinGame(req.body.username));
        res.json({ hotdog: cache.get('gameID') });
    })

    app.post('/startGame/:id', (req, res) => {
        const id = req.params.id || 1;
        // TODO Only create new game instance if tehre isn't already one
        const gameInstance = new Game(id);
        // If game instance available, attempt to join it as player2
        //TODO Return authentication token?

        const cacheObject = {
            [id]: gameInstance
        };
        cache.set("games", cacheObject );
        console.log(cache.get('games'));
        // const clients = cache.get('clientID');
        // When client closes connection we update the clients list
        // avoiding the disconnected one
        req.on('close', () => {
            console.log(` Connection closed`);
        });
    })

    app.get('/status', (req, res) => res.json({clients: clients.length}));

    return app;
}