import React from 'react';
import Cell from './Cell';
import './Board.css';

const Board = (props) => {
    const { onCellAttack, board } = props;
    
    const getCellColor = (x,y) => {
        const { hit, sunk } = board[y][x];
        if (sunk) return 'darkred';
        if (hit === 'ship') return 'red';
        if (hit === 'miss') return 'darkgray';
        return 'gray';
    }

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
