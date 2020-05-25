
module.exports.Game = class Game {
    constructor(gameID) { // gameID: int
        this.gameID = gameID;
        this.currentTurn = '';
        this.player1 = '';
        this.player2 = '';
        this.player1ShipCoordinates = {};
        this.player2ShipCoordinates = {};
        this.player1AttackCoordinates = [];
        this.player2AttackCoordinates = [];
    }

    getPlayerType(player) {
        let playerType = 'spectator';
        if (player === this.player1) playerType = 'player1';
        else if (player === this.player2) playerType = 'player2';

        return playerType;
    }

    player1AttackPos(point) { // point : [x,y]
        if (Game.pointExistsInArray(point, this.player1AttackCoordinates)) throw (new Error('Coordinate attacked before!'));
        const enemyShipCoords = this.player2ShipCoordinates;
        const keys = Object.keys(enemyShipCoords);

        let result = null;
        keys.some((shipName) => {
            const currentShipCoords = enemyShipCoords[shipName];
            // filter out coords already hit
            const remainingShipCoords = Game.filterPointsFromArr(this.player1AttackCoordinates, currentShipCoords);

            const didHitShip = Game.pointExistsInArray(point, remainingShipCoords);

            if (didHitShip) {
                if (remainingShipCoords.length === 1) {
                    result = { result: 'Hit', sunk: true, ship: shipName, shipCoords: enemyShipCoords[shipName] };
                    return true;
                }
                result = { result: 'Hit', sunk: false };
                return true;
            }

            return false;
        });

        this.player1AttackCoordinates.push(point);
        if (result) return result;
        return { result: 'Miss' };
    }

    player2AttackPos(point) { // point : [x,y]
        if (Game.pointExistsInArray(point, this.player2AttackCoordinates)) throw (new Error('Coordinate attacked before!'));

        const enemyShipCoords = this.player1ShipCoordinates;
        const keys = Object.keys(enemyShipCoords);

        let result = null;
        keys.forEach((shipName) => {
            const currentShipCoords = enemyShipCoords[shipName];
            // filter out coords already hit
            const remainingShipCoords = Game.filterPointsFromArr(this.player2AttackCoordinates, currentShipCoords);

            const didHitShip = Game.pointExistsInArray(point, remainingShipCoords);

            if (didHitShip) {
                if (remainingShipCoords.length === 1) {
                    result = { result: 'Hit', sunk: true, ship: shipName, shipCoords: enemyShipCoords[shipName] };
                    return true;
                }
                result = { result: 'Hit', sunk: false };
                return true;
            }
            return false;
        });

        this.player2AttackCoordinates.push(point);
        if (result) return result;
        return { result: 'Miss' };
    }

    player1SetupShips(shipCoords) {
        if (Game.shipSetupIsValid(shipCoords)) {
            this.player1ShipCoordinates = shipCoords;
            this.player1ShipsLeft = Object.keys(shipCoords).length;
        }
    }

    player2SetupShips(shipCoords) {
        if (Game.shipSetupIsValid(shipCoords)) {
            this.player2ShipCoordinates = shipCoords;
            this.player2ShipsLeft = Object.keys(shipCoords).length;
        }
    }

    hasPlayer1Won() {
        const ships = Object.keys(this.player1ShipCoordinates);

        let result = true;
        ships.forEach((shipName) => {
            // filter out coords already hit
            const remainingShipCoords = Game.filterPointsFromArr(this.player1AttackCoordinates, this.player2ShipCoordinates[shipName]);
            if (remainingShipCoords.length !== 0) result = false;
        });

        return result;
    }

    hasPlayer2Won() {
        const ships = Object.keys(this.player2ShipCoordinates);

        let result = true;
        ships.forEach((shipName) => {
            // filter out coords already hit
            const remainingShipCoords = Game.filterPointsFromArr(this.player2AttackCoordinates, this.player1ShipCoordinates[shipName]);
            if (remainingShipCoords.length !== 0) result = false;
        });

        return result;
    }

    static shipSetupIsValid(shipCoords) {
        const keys = Object.keys(shipCoords);

        if (keys.length !== 5) throw new Error(`Invalid number of ships: ${keys.length}. Expected : 5`);

        keys.forEach((shipName) => {
            const shipCoordsArr = shipCoords[shipName];
            Game.validateSingleShipCoords(shipName, shipCoordsArr);
        });

        return true;
    }

    static validateSingleShipCoords(shipName, shipCoordsArr) {
        const shipLength = {
            patrol: 2,
            destroyer: 3,
            submarine: 3,
            battleship: 4,
            carrier: 5,
        };
        if (!shipLength[shipName]) throw new Error(`Invalid ship name: ${shipName}!`);

        if (shipCoordsArr.length === shipLength[shipName]) {
            shipCoordsArr.forEach((point) => {
                if (point.length !== 2) throw new Error(`Array of shipCoords: ${shipCoordsArr} are not all points! ${point}`);
            });
        } else throw new Error(`Invalid array length ${shipCoordsArr.length} for ship of size ${shipLength[shipName]}`);

        return true;
    }

    static pointExistsInArray(point, arr) { // point: [x,y] , arr: [[x1,y1],[x2,y2],...]
        const [x, y] = point;

        const result = arr.some((coordinate) => {
            const [comparisonX, comparisonY] = coordinate;
            if (x === comparisonX && y === comparisonY) return true;
            return false;
        });

        return result;
    }

    static filterPointsFromArr(filterArr, sourceArr) {
        const filteredArr = sourceArr.filter((coord) => !Game.pointExistsInArray(coord, filterArr));

        return filteredArr;
    }
};
