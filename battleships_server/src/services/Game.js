
const shipLength = require('../constants/ships');

module.exports.Game = class Game {
    constructor(gameID) { // gameID: int
        this.gameID = gameID;
        this.gameStarted = false;
        this.bothPlayersJoined = false;
        this.player1 = '';
        this.player2 = '';
        this.player1ShipCoordinates = {};
        this.player2ShipCoordinates = {};
        this.player1AttackCoordinates = [];
        this.player2AttackCoordinates = [];
    }

    player1AttackPos(point) { // point : [x,y]
        if (this.pointExistsInArray(point, this.player1AttackCoordinates)) throw (new Error('Coordinate attacked before!'));

        this.player1AttackCoordinates.push(point);
        // TODO return 'Hit', 'Miss', or ship destroyed
    }

    player2AttackPos(point) { // point : [x,y]
        if (this.pointExistsInArray(point, this.player2AttackCoordinates)) throw (new Error('Coordinate attacked before!'));

        this.player2AttackCoordinates.push(point);
        // TODO return 'Hit', 'Miss', or ship destroyed
    }

    joinGame(username) {
        if (this.player1) {
            this.player2 = username;
            this.bothPlayersJoined = true;
        } else this.player1 = username;
    }

    player1SetupShips(shipCoords) {
        if (this.shipSetupIsValid(shipCoords)) {
            this.player1ShipCoordinates = shipCoords;
        }
    }

    player2SetupShips(shipCoords) {
        if (this.shipSetupIsValid(shipCoords)) {
            this.player2ShipCoordinates = shipCoords;
        }
    }

    shipSetupIsValid(shipCoords) {
        const keys = Object.keys(shipCoords);

        if (keys.length !== 5) throw new Error(`Invalid number of ships: ${keys.length}. Expected : 5`);

        keys.forEach((shipName) => {
            const shipCoordsArr = shipCoords[shipName];
            this.validateShipCoords(shipCoordsArr, shipName);
        });

        return true;
    }

    static validateShipCoords(shipCoordsArr, shipName) {
        if (!shipLength[shipName]) throw new Error(`Invalid ship name: ${shipName}!`);

        if (shipCoordsArr.length === shipLength[shipName]) {
            shipCoordsArr.forEach((point) => {
                if (point.length !== 2) throw new Error(`Array of shipCoords: ${shipCoordsArr} are not all points! ${point}`);
            });
        } else throw new Error(`Invalid array length for ship of size ${shipLength[shipName]}`);

        return true;
    }

    static pointExistsInArray(point, arr) { // point: [x,y] , arr: [[x1,y1],[x2,y2],...]
        const [x, y] = point;

        arr.forEach((coordinate) => {
            const [comparisonX, comparisonY] = coordinate;
            if (x === comparisonX && y === comparisonY) return true;
            return false;
        });

        return false;
    }
};
