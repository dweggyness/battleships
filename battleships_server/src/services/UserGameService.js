
const { GameRapidFire: Game } = require('./GameRapidFire');
const { ongoingGamesCache } = require('../cache/cache');
const { io } = require('../app');

module.exports.UserGameService = class UserGameService {
    constructor(socket) {
        this.socket = socket;
        this.clientID = socket.id;
        this.gameID = '';
    }

    isGameInstanceReady() {
        const { game } = ongoingGamesCache.get(this.gameID);

        return (game && game.player1 && game.player2);
    }

    attackPos(attackPos) {
        if (!this.isGameInstanceReady()) throw new Error('Both players have not connected yet!');
        if (attackPos.length !== 2) throw new Error(`Expected array length of 2, got: ${attackPos}`);
        const { game } = ongoingGamesCache.get(this.gameID);

        const playerType = game.getPlayerType(this.clientID);
        if (game.currentTurn !== playerType) throw new Error('Not your turn!');

        let result = '';
        if (playerType === 'player1') {
            result = game.player1AttackPos(attackPos);
        } else if (playerType === 'player2') {
            result = game.player2AttackPos(attackPos);
        }

        io.in(this.gameID).emit('gameStream', { player: playerType, attackPos, result });
        io.in(this.gameID).emit('nextPlayer', { nextPlayer: game.currentTurn });
    }

    setupGameInstance(gameID, shipCoords) {
        if (this.gameID && ongoingGamesCache.get(this.gameID)) throw new Error('You are already in a game!');
        this.gameID = gameID;
        this.socket.join(gameID);

        const existingGameInstance = ongoingGamesCache.get(this.gameID);
        let gameInstance = {};
        if (existingGameInstance) {
            const { game } = existingGameInstance;

            game.player2SetupShips(shipCoords);
            game.player2 = this.clientID;
            gameInstance = game;
        } else {
            const game = new Game(this.gameID);

            game.player1 = this.clientID;
            game.player1SetupShips(shipCoords);
            gameInstance = game;
        }

        ongoingGamesCache.update(gameID, { game: gameInstance });
        this.socket.emit('playerType', { player: gameInstance.getPlayerType(this.clientID) });
    }

    startGame() {
        const { game } = ongoingGamesCache.get(this.gameID);

        const arr = ['player1', 'player2'];
        const startingPlayer = arr[Math.floor(Math.random() * 2)];
        game.currentTurn = startingPlayer;
        io.in(this.gameID).emit('nextPlayer', { nextPlayer: game.currentTurn });
    }

    checkForPlayerVictory() {
        const { game } = ongoingGamesCache.get(this.gameID);

        if (game.hasPlayer1Won()) this.handleWinner('player1', 'victory');
        if (game.hasPlayer2Won()) this.handleWinner('player2', 'victory');

        return false;
    }

    handleDisconnect(disconnectedClientID) {
        const { game } = ongoingGamesCache.get(this.gameID);

        if (game) {
            const disconnectedPlayer = game.getPlayerType(disconnectedClientID);
            let winner;
            if (disconnectedPlayer === 'player1') winner = 'player2';
            else winner = 'player1';
            this.handleWinner(winner, 'opponent disconnected');
        }
    }

    handleError(error) {
        this.socket.emit('errorMessage', { error });
    }

    handleWinner(player, reason) {
        io.in(this.gameID).emit('gameStream', { winner: player, reason });
        this.endGameCleanup();
    }

    endGameCleanup() {
        ongoingGamesCache.del(this.gameID);
        this.gameID = '';
    }
};
