import React from 'react';
import XCross from './XCross';
import './Cell.css';

const Cell = React.forwardRef((props, ref) => {
    const { onClick, hitState } = props;
    return <td
        className={'cell'}
        ref={ref}
        onClick={onClick}
    >
        {hitState === 'ship' && <XCross color={'rgb(255, 55, 55)'} />}
        {hitState === 'miss' && <XCross color={'rgb(150, 150, 150)'} />}
        {props.children}
    </td>;
});

Cell.displayName = 'Cell';
export default Cell;
