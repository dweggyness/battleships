
const shipLength = require('./constants/ships');

var gameID = {}

class Game {
    constructor(gameID) { // gameID: int
        this.gameID = gameID;
        this.gameStarted = false;
        this.bothPlayersJoined = false;
        this.player1 = "";
        this.player2 = "";
        this.player1ShipCoordinates = {};
        this.player2ShipCoordinates = {};
        this.player1AttackCoordinates = [];
        this.player2AttackCoordinates = [];
    }

    player1AttackPos(point) { // point : [x,y]
        if (this.pointExistsInArray(point, player1AttackCoordinates)) throw (new Error('Coordinate attacked before!'));

        this.player1AttackCoordinates.push(point)
    }

    player2AttackPos(point) { // point : [x,y]
        if (this.pointExistsInArray(point, player2AttackCoordinates)) throw (new Error('Coordinate attacked before!'));

        this.player2AttackCoordinates.push(point)
    }

    joinGame(username) {
        if (this.player1) {
            this.player2 = username;
            this.bothPlayersJoined = true;
        }
        else this.player1 = username;
    }

    player1SetupShips(shipCoords) { // shipCoords { 'patrol': [[x1,y1], [x2,y2]] 'submarine': ... 'destroyer': ... 5: ....}
        if ( shipSetupIsValid ) {
            this.player1ShipCoordinates = shipCoords;
        }
    }

    player2SetupShips(shipCoords) {
        if ( shipSetupIsValid ) {
            this.player2ShipCoordinates = shipCoords;
        }
    }

    shipSetupIsValid(shipCoords) {
        const keys = Object.keys(shipCoords);

        if (keys.length !== 5) throw new Error(`Invalid number of ships: ${keys.length}. Expected : 5`)

        keys.forEach(shipName => {
            shipCoordsArr = shipCoords[shipName];
            this.validateShipCoords(shipCoordsArr, shipName);
        })

        return true;
    }

    validateShipCoords(shipCoordsArr, shipName) {
        if (!shipLength[shipName]) throw new Error(`Invalid ship name: ${shipName}!`)

        if (shipCoordsArr.length == shipLength[shipName]) {
            shipCoordsArr.forEach(point => {
                if ( point.length !== 2 ) throw new Error(`Array of shipCoords: ${shipCoords} are not all points! ${point}`)
            })
        } else throw new Error(`Invalid array length for ship of size ${shipSize}`)

        return true;
    }

    pointExistsInArray(point, arr) { // point: [x,y] , arr: [[x1,y1],[x2,y2],...]
        const [ x, y ] = point;

        arr.forEach(coordinate => {
            var [ comparisonX, comparisonY ] = coordinate;

            if ( x === comparisonX && y === comparisonY ) return true;
        })

        return false
    }
}

exports.setRoutes = async (app) => {
    app.get('/', (req, res) => res.send("Hello World!"))

    app.post('/attackPos', (req, res) => {
        console.log(gameID[1].joinGame('hotdog'));
        res.json({ gameID , attackPos: req.body.attackPos});
    })

    app.post('/startGame', (req, res) => {
        gameID[req.body.gameID] = new Game(req.body.gameID);
        res.json({ status: 1 })
    })

    return app;
}