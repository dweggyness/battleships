import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import isShipPositionValid from '../utils/isShipPositionValid';
import buildShipCoords from '../utils/buildShipCoords';
import PlayerShip from './PlayerShip';
import './Cell.css';

const Cell = (props) => {
    const { handlePlayerShipCoordsChange, point, onClick, backgroundColor, playerShipCoords } = props;
    const [{ isPointerOver, isLegalMove, ship }, drop] = useDrop({
        accept: 'ship',
        drop: ({ ship: { shipName, layout, length } }) => {
            const shipCoordinates = buildShipCoords({ point, layout, length });
            const newShipCoords = { ...playerShipCoords, [shipName]: shipCoordinates };
            handlePlayerShipCoordsChange(newShipCoords);
        },
        canDrop: ({ ship: { shipName, layout, length } }) => {
            const shipCoordinates = buildShipCoords({ point, layout, length });
            const otherShipCoords = { ...playerShipCoords };
            delete otherShipCoords[shipName];
            return isShipPositionValid(shipCoordinates, otherShipCoords);
        },
        collect: (monitor) => ({
            ship: monitor.getItem(),
            isPointerOver: monitor.isOver(),
            isLegalMove: monitor.canDrop(),
        }),
    });

    return <div
        className={'cell'}
        ref={drop}
        style={{ backgroundColor }}
        onClick={onClick}
    >
        {isPointerOver && isLegalMove && <PlayerShip ship={ship.ship} hovering={true}/>}
        {props.children}
    </div>;
};

export default Cell;
