
import isPointWithinBounds from './isPointWithinBounds';

// A valid ship position -
// 1 ) within bounds of the grid
// 2 ) does not occupy the same grid space as any other ship

export default function (shipCoords, otherShipCoords) {
    if (shipCoords.every((coords) => isPointWithinBounds(coords))) {
        const allShipCoords = Object.values(otherShipCoords).flat();
        return shipCoords.every((coords) => {
            return allShipCoords.every((comparisonCoords) => {
                return !(comparisonCoords[0] === coords[0] && comparisonCoords[1] === coords[1]);
            });
        });
    }

    return false;
};