
import isPointWithinBounds from './isPointWithinBounds';

// A valid ship position -
// 1 ) within bounds of the grid
// 2 ) does not occupy the same grid space as any other ship

export default function (shipCoords, otherShipsObject) {
    if (shipCoords.every((coords) => isPointWithinBounds(coords))) {
        const otherShipCoords = Object.values(otherShipsObject).flat();
        return shipCoords.every((coords) => {
            return otherShipCoords.every((comparisonCoords) => {
                return !(comparisonCoords[0] === coords[0] && comparisonCoords[1] === coords[1]);
            });
        });
    }

    return false;
};