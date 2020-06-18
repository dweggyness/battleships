
// Given ship coordinates and the board, returns the number of ships still alive

import isShipSunk from './isShipSunk';

export default function (shipCoords, board) {
    const ships = Object.keys(shipCoords);

    let remainingShips = ships.length;
    ships.forEach((shipName) => {
        if (isShipSunk(shipCoords[shipName], board)) remainingShips--;
    });

    return remainingShips;
}
