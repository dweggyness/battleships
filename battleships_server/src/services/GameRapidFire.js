
const { Game } = require('./Game');

module.exports.GameRapidFire = class GameRapidFire extends Game {
    constructor(gameID) {
        super(gameID);
        this.currentPlayerTurnsLeft = 5;
    }

    getNextPlayerTurn() {
        console.log(this.currentPlayerTurnsLeft, this.currentTurn);
        if (this.currentPlayerTurnsLeft > 1) {
            this.currentPlayerTurnsLeft -= 1;
            return this.currentTurn;
        }

        if (this.currentTurn === 'player1') {
            this.currentPlayerTurnsLeft = this.player2RemainingShips();
            return 'player2';
        }
        if (this.currentTurn === 'player2') {
            this.currentPlayerTurnsLeft = this.player1RemainingShips();
            return 'player1';
        }
    }

    player2RemainingShips() {
        const ships = Object.keys(this.player2ShipCoordinates);

        let result = ships.length;
        ships.forEach((shipName) => {
            // filter out coords already hit
            const remainingShipCoords = Game.filterPointsFromArr(this.player1AttackCoordinates, this.player2ShipCoordinates[shipName]);
            if (remainingShipCoords.length === 0) result -= 1;
        });

        return result;
    }

    player1RemainingShips() {
        const ships = Object.keys(this.player1ShipCoordinates);

        let result = ships.length;
        ships.forEach((shipName) => {
            // filter out coords already hit
            const remainingShipCoords = Game.filterPointsFromArr(this.player2AttackCoordinates, this.player1ShipCoordinates[shipName]);
            if (remainingShipCoords.length === 0) result -= 1;
        });

        return result;
    }
};
