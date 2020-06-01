import React from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import './Cell.css';

const PlayerShip = (props) => {
    const { destroyed, ship } = props;
    const [, drag] = useDrag({
        item: { type: 'ship', ship },
    });

    if (!ship) return null;

    let height = 1.5;
    let width = 1.5;
    let paddingRight = 0;
    let paddingBottom = 0;

    const { layout, length } = ship;
    if (layout === 'horizontal') {
        width += (length - 1) * 2;
        paddingRight = `${3 * length}px`;
    } else if (layout === 'vertical') {
        height += (length - 1) * 2;
        paddingBottom = `${3 * length}px`;
    }

    const style = {
        width: `${width}em`,
        height: `${height}em`,
        paddingRight,
        paddingBottom,

        position: 'absolute',
        backgroundColor: destroyed ? 'rgba(255, 0 ,0 , 0.1)' : 'rgba(0, 0, 255, 0.1)',
        borderRadius: '10px',
        border: destroyed ? '2px solid red' : '2px solid blue',
        margin: '2px 0 0 2px',
    };

    return <div
        ref={drag}
        style={style}
    />;
};

PlayerShip.propTypes = {
    destroyed: PropTypes.bool,
    ship: PropTypes.shape({
        point: PropTypes.array,
        layout: PropTypes.oneOf(['horizontal', 'vertical']),
        length: PropTypes.number,
    }),
};


export default PlayerShip;
