
import isPointWithinBounds from './isPointWithinBounds';
import isShipPositionValid from './isShipPositionValid';

const shipObject = {
    patrol: 2,
    destroyer: 3,
    submarine: 3,
    battleship: 4,
    carrier: 5,
};

export default function (gridSize) {
    const shipCoords = {};
    const directions = ['h', 'v']
    const shipNames = Object.keys(shipObject);
    shipNames.forEach((ship) => {
        const shipLength = shipObject[ship];
        let iterations = 0;
        while ( iterations < 10000) {
            iterations++;
            const randomXCoord = Math.floor(Math.random() * 10);
            const randomYCoord = Math.floor(Math.random() * 10);
            const randomDirection = directions[Math.floor(Math.random() * 2)];

            const curShipCoords = [[randomXCoord, randomYCoord]];
            for ( let i = 1; i < shipLength; i++ ) {
                if (randomDirection === 'h') {
                    const nextCoord = [curShipCoords[i - 1][0] + 1, randomYCoord];
                    curShipCoords.push(nextCoord);
                }
                if (randomDirection === 'v') {
                    const nextCoord = [randomXCoord, curShipCoords[i - 1][1] + 1];
                    curShipCoords.push(nextCoord);
                }
            }

            if (isShipPositionValid(curShipCoords, shipCoords)) {
                shipCoords[ship] = curShipCoords;
                break;
            }
        }
    });

    return shipCoords;
}
