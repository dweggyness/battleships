import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import CellWithPlayerShipHandling from './CellWithPlayerShipHandling';
import PlayerShip from './PlayerShip';
import './Board.css';

const Board = (props) => {
    const { handlePlayerShipCoordsChange, changeShipPos, playerShipCoords, onCellAttack = () => {}, board } = props;
    const [_board, _setBoard] = useState();

    useEffect(() => {
        if (!board) return;
        const ship = Object.keys(playerShipCoords);
        // deep cloning the nested array
        const tempBoard = JSON.parse(JSON.stringify(board));
        ship.forEach((shipName) => {
            const curShip = playerShipCoords[shipName];
            const shipCoord = [curShip[0][0], curShip[0][1]];
            const shipLayout = curShip[1][0] !== curShip[0][0] ? 'horizontal' : 'vertical';
            const tempBoardData = tempBoard[curShip[0][1]][curShip[0][0]];
            tempBoard[shipCoord[1]][shipCoord[0]] = { ...tempBoardData, ship: { shipName, layout: shipLayout, length: curShip.length } };
        });
        _setBoard(tempBoard);
    }, [playerShipCoords, board]);

    const getCellColor = (x, y) => {
        const { hit, sunk, dragOver } = board[x][y];

        return 'transparent';

        let cellColor = 'gray';
        if (sunk) cellColor = 'darkred';
        if (hit === 'ship') cellColor = 'red';
        if (hit === 'miss') cellColor = 'darkgray';
        if (dragOver) cellColor = 'green';
        return cellColor;
    };

    const changeShipPosition = (shipName, shipPos) => {
        changeShipPos(shipName, shipPos);
    };

    if (!_board) return null;

    return (
        <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
            <table className={'grid'}><tbody>
                {_board.map((row) => (<tr className={'board'} key={row[0].x + row[0].y * 1000}>
                    {row.map((cell) => (
                        <CellWithPlayerShipHandling
                            key={cell.x + cell.y * 10}
                            point={[cell.x, cell.y]}
                            hit={cell.hit}
                            shipInCell={cell.ship}
                            backgroundColor={getCellColor(cell.x, cell.y)}
                            onClick={() => onCellAttack(cell.x, cell.y)}
                            handlePlayerShipCoordsChange={handlePlayerShipCoordsChange}
                            playerShipCoords={playerShipCoords}
                        />
                    ))}
                </tr>
                ))}
            </tbody></table>
        </DndProvider>
    );
};

Board.propTypes = {
    isPlayer: PropTypes.bool,
    playerShipCoords: PropTypes.object,
    changeShipPos: PropTypes.func,
    onCellAttack: PropTypes.func,
    board: PropTypes.array,
};

export default Board;
