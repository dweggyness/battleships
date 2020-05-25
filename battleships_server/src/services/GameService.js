
const { Game } = require('./Game');
const { ongoingGamesCache, clientsCache } = require('../cache/cache');
const { io } = require('./app');

module.exports.GameService = class GameService {
    constructor(socket) {
        this.socket = socket;
        this.clientID = socket.id;
    }

    attackPos(attackPos) {
        const { gameID: curGameID } = clientsCache.get(this.clientID);
        const { game } = ongoingGamesCache.get(curGameID);

        let result = '';
        const playerType = game.getPlayerType(this.clientID);
        // if (game.currentTurn !== playerType) throw new Error('Not your turn!');
        if (playerType === 'player1') {
            result = game.player1AttackPos(attackPos);
            console.log('win?', game.hasPlayer1Won());
            game.currentTurn = 'player2';
        } else if (playerType === 'player2') {
            result = game.player2AttackPos(attackPos);
            console.log(game.hasPlayer2Won());
            game.currentTurn = 'player1';
        }

        io.in(curGameID).emit('message', { player: playerType, attackPos, result, nextPlayer: game.currentTurn });
    }

    startGame(gameID, setupShipCoords) {
        const existingGameInstance = ongoingGamesCache.get(gameID);
        let gameInstance = {};
        if (existingGameInstance) {
            const { game } = existingGameInstance;

            game.player2SetupShips(setupShipCoords);
            game.player2 = this.clientID;
            gameInstance = game;
        } else {
            const game = new Game(gameID);

            game.player1 = this.clientID;
            game.player1SetupShips(setupShipCoords);
            gameInstance = game;
        }

        this.socket.join(gameID);
        ongoingGamesCache.update(gameID, { game: gameInstance });
        clientsCache.update(this.clientID, { gameID });

        console.log(gameInstance);
        this.socket.emit('message', { playerType: gameInstance.getPlayerType(this.clientID) });
    }

    handleError(error) {
        this.socket.emit('message', { error });
    }

    endGame(player) {
        const { gameID } = clientsCache.get(this.clientID);
        ongoingGamesCache.del(gameID);
    }
}