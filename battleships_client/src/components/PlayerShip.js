import React from 'react';
import './Cell.css';

const PlayerShip = (props) => {
    const { ship: { layout, length } } = props;

    var height = 2.5;
    var width = 2.5;
    var paddingRight = 0;
    var paddingBottom = 0;

    if (layout === 'horizontal') {
        width *= length;
        paddingRight = `${0.2 * length }em`;
    }
    else if (layout === 'vertical') {
        height *= length;
        paddingBottom = `${0.2 * length }em`;
    }

    return <div
        draggable
        style={{ margin: '-2px', paddingRight, paddingBottom, position: 'absolute', backgroundColor: 'rgba(0,0,255,0.2)', width: `${width}em`, height: `${height}em`, border: '2px solid blue' }}
    />;
};

export default PlayerShip;
