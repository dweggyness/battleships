import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';

const Ship = styled.div`
    position: absolute;
    margin: 2.25px 0 0 2.25px;
    border-radius: 10px;
`;

const Battleship = (props) => {
    const { areShipsMovable = false, touchable = true, sunk, hovering, handleShipRotate = () => {}, ship } = props;
    const [{ isDragging }, drag] = useDrag({
        item: { type: 'ship', ship },
        canDrag: () => areShipsMovable,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    if (!hovering && isDragging) return null;

    let height = 1.5;
    let width = 1.5;

    const { layout, length } = ship;
    if (layout === 'horizontal') width += (length - 1) * 2.125;
    else if (layout === 'vertical') height += (length - 1) * 2.125;

    let backgroundColor = 'rgba(0, 0, 255, 0.1)';
    let border = '2px solid blue';

    if (sunk) { backgroundColor = 'rgba(255, 0, 0, 0.3)'; border = '2px solid red'; }
    if (hovering) { backgroundColor = 'rgba(255, 200, 0, 0.3)'; border = '2px solid orange'; }

    const style = {
        width: `${width}em`,
        height: `${height}em`,
        pointerEvents: touchable ? 'auto' : 'none',
        backgroundColor,
        border,
    };

    return <Ship
        ref={drag}
        style={style}
        onClick={handleShipRotate}
    />;
};

Battleship.propTypes = {
    destroyed: PropTypes.bool,
    ship: PropTypes.shape({
        point: PropTypes.array,
        layout: PropTypes.oneOf(['horizontal', 'vertical']),
        length: PropTypes.number,
    }),
};


export default Battleship;
