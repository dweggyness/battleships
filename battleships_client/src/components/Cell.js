import React from 'react';
import PlayerShip from './PlayerShip';
import './Cell.css';

const Cell = React.forwardRef((props, ref) => {
    const { onClick } = props;
    return <td
        className={'cell'}
        ref={ref}
        onClick={onClick}
    >
        {props.children}
    </td>;
});

Cell.displayName = 'Cell';
export default Cell;
