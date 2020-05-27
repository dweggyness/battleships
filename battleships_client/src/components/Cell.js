import React from 'react';
import './Cell.css';

const Cell = (props) => {
    const { onClick, backgroundColor } = props;

    return <div
        className={`cell`}
        style={{ backgroundColor }}
        onClick={onClick}
    />;
};

export default Cell;
