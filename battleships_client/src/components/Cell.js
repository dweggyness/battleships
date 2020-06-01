import React, { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import isShipPositionValid from '../utils/isShipPositionValid';
import buildShipCoords from '../utils/buildShipCoords';
import './Cell.css';

const Cell = (props) => {
    const { handlePlayerShipCoordsChange, point, onClick, backgroundColor, playerShipCoords } = props;
    const [, drop] = useDrop({
        accept: 'ship',
        drop: ({ ship: { shipName, layout, length } }) => {
            const shipCoordinates = buildShipCoords({ point, layout, length });
            const newShipCoords = {...playerShipCoords, [shipName]: shipCoordinates}
            handlePlayerShipCoordsChange(newShipCoords);
        },
        canDrop: ({ ship: { layout, length } }) => {
            const shipCoordinates = buildShipCoords({ point, layout, length });
            return isShipPositionValid(shipCoordinates, playerShipCoords);
        },
    });

    return <div
        className={'cell'}
        ref={drop}
        style={{ backgroundColor }}
        onClick={onClick}
    >
        {props.children}
    </div>;
};

export default Cell;
