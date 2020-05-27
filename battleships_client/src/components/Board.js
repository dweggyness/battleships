import React from 'react';
import Cell from './Cell';
import './Board.css';

const Board = (props) => {
    const { onCellAttack, board } = props;

    const getCellColor = (x,y) => {
        const { hit, sunk, hasPlayerShip } = board[y][x];

        let cellColor = 'gray';
        if (sunk) cellColor = 'darkred';
        if (hit === 'ship') cellColor = 'red';
        if (hit === 'miss') cellColor = 'darkgray';
        if (hasPlayerShip) cellColor = 'blue';
        return cellColor;
    };

    return (
        <div>
            {board.map((row, y) => {
                return (<div className={'board'} key={y}>
                    {row.map((cell, x) => {
                        return <Cell
                            key={x}
                            hit={cell.hit}
                            backgroundColor={getCellColor(x,y)}
                            onClick={() => onCellAttack(x, y)}
                        />;
                    })}
                </div>
                );
            })}
        </div>
    );
};

export default Board;
