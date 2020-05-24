
const { Game } = require('./services/Game')
const cache = require('./cache/cache')
// TODO : begin using node-cache

exports.setRoutes = async (app) => {
    app.post('/attackPos', (req, res) => {
        console.log(cache.get('gameID')[req.body.gameID].joinGame(req.body.username));
        res.json({ hotdog: cache.get('gameID') });
    })

    app.post('/startGame/:id', (req, res) => {
        // TODO Only create new game instance if tehre isn't already one
        // If game instance available, attempt to join it as player2
        //TODO Return authentication token?
        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };
        res.writeHead(200, headers);

        const clientId = 1;
        const newClient = {
            id: clientId,
            res: res
        };
        cache.set("games", { 1: new Game(1) });
        cache.update("games", { 2: new Game(2) })
        cache.update("games", { 4: new Game(4) })
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