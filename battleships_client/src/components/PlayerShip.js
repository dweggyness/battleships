import React from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import './Cell.css';

const PlayerShip = (props) => {
    const { areShipsMovable = false, hovering, onShipRotate = () => {}, ship } = props;
    const [{ isDragging }, drag] = useDrag({
        item: { type: 'ship', ship },
        canDrag: () => {
            return areShipsMovable;
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    if (!hovering && isDragging) return null;

    let height = 1.5;
    let width = 1.5;

    const { layout, length } = ship;
    if (layout === 'horizontal') {
        width += (length - 1) * 2.125;
    } else if (layout === 'vertical') {
        height += (length - 1) * 2.125;
    }

    const style = {
        width: `${width}em`,
        height: `${height}em`,

        position: 'absolute',
        backgroundColor: hovering ? 'rgba(255, 200, 0, 0.3)' : 'rgba(0, 0, 255, 0.1)',
        borderRadius: '10px',
        border: hovering ? '2px solid orange' : '2px solid blue',
        margin: '2.25px 0 0 2.25px',
    };

    return <div
        ref={drag}
        style={style}
        onClick={onShipRotate}
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
