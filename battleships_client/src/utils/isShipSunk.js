
export default function (shipCoords, board) {
    return shipCoords.every((coords) => (board[coords[1]][coords[0]].hit === 'ship'));
}
