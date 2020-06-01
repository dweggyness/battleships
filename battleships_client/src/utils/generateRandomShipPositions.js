
import isShipPositionValid from './isShipPositionValid';
import buildShipCoords from './buildShipCoords';

const shipObject = {
    patrol: 2,
    destroyer: 3,
    submarine: 3,
    battleship: 4,
    carrier: 5,
};

export default function (gridSize) {
    const shipCoords = {};
    const directions = ['horizontal', 'vertical'];
    const shipNames = Object.keys(shipObject);
    shipNames.forEach((ship) => {
        const shipLength = shipObject[ship];
        let iterations = 0;
        while (iterations < 10000) {
            iterations++;
            const randomXCoord = Math.floor(Math.random() * 10);
            const randomYCoord = Math.floor(Math.random() * 10);
            const randomDirection = directions[Math.floor(Math.random() * 2)];

            const curShipCoords = buildShipCoords({
                point: [randomXCoord, randomYCoord],
                layout: randomDirection,
                length: shipLength,
            });

            if (isShipPositionValid(curShipCoords, shipCoords)) {
                shipCoords[ship] = curShipCoords;
                break;
            }
        }
    });

    return shipCoords;
}
