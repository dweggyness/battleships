
export default function (shipCoords, board) {
    if (!shipCoords || !board) return false;
    return shipCoords.every((coords) => (board[coords[1]][coords[0]].hit === 'ship'));
}
