import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Cell from './Cell';
import PlayerShip from './PlayerShip';
import './Board.css';

const Board = (props) => {
    const { isPlayer, changeShipPos, playerShipCoords, onCellAttack, board } = props;
    const [_board, _setBoard] = useState();

    useEffect(() => {
        if (!board) return;
        const ship = Object.keys(playerShipCoords);
        const tempBoard = board;
        ship.forEach((shipName) => {
            const curShip = playerShipCoords[shipName];
            const shipStartingCoord = [curShip[0][0], curShip[0][1]];
            const shipLayout = curShip[1][0] !== curShip[0][0] ? 'horizontal' : 'vertical';
            const tempBoardData = board[curShip[0][0]][curShip[0][1]];
            tempBoard[shipStartingCoord[0]][shipStartingCoord[1]] = { ...tempBoardData, ship: { layout: shipLayout, length: curShip.length } };
        });
        _setBoard(tempBoard);
    }, [board]);

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
        <table className={'grid'}>
            {_board.map((row, y) => (<tr className={'board'} key={y}>
                {row.map((cell, x) => (<td className={'battleship-cell'} key={x}>
                    {_board[x][y].ship
                        ? <PlayerShip ship={_board[x][y].ship} />
                        : <Cell
                            key={y}
                            hit={cell.hit}
                            backgroundColor={getCellColor(x, y)}
                            onClick={() => onCellAttack(x, y)}
                        />
                    }
                </td>
                ))}
            </tr>
            ))}
        </table>
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
