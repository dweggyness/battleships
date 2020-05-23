
const { Game } = require('./services/Game')
// TODO : begin using node-cache
var gameID = {}
var clients = []

exports.setRoutes = async (app) => {
    app.get('/', (req, res) => res.send("Hello World!"))

    app.post('/attackPos', (req, res) => {
        console.log(gameID[req.body.gameID].joinGame(req.body.username));
        res.json({ gameID });
    })

    app.post('/startGame/:id', (req, res) => {
        const id = req.param.id;

        // TODO Only create new game instance if tehre isn't already one
        // If game instance available, attempt to join it as player2, otherwise as spectator
        gameID[req.body.gameID] = new Game(req.body.gameID);
        res.json({ status: 1 })
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
        res
        };
        clients.push(newClient);
        // When client closes connection we update the clients list
        // avoiding the disconnected one
        req.on('close', () => {
            console.log(`${clientId} Connection closed`);
            clients = clients.filter(c => c.id !== clientId);
        });
    })

    app.get('/status', (req, res) => res.json({clients: clients.length}));

    return app;
}