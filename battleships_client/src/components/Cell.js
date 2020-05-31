import React from 'react';
import './Cell.css';

const Cell = (props) => {
    const { onClick, backgroundColor } = props;

    return <td
        className={`cell`}
        style={{ backgroundColor }}
        onClick={onClick}
    >
        {props.children}
    </td>;
};

export default Cell;
