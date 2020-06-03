import React from 'react';
import { useDrop } from 'react-dnd';
import isShipPositionValid from '../utils/isShipPositionValid';
import buildShipCoords from '../utils/buildShipCoords';
import PlayerShip from './PlayerShip';
import Cell from './Cell';
import './Cell.css';

const CellWithShipHandling = (props) => {
    const { handleShipCoordsChange, point, shipInCell, backgroundColor, shipCoords } = props;
    const [{ isPointerOver, isLegalMove, movingShip }, drop] = useDrop({
        accept: 'ship',
        drop: ({ ship }) => {
            updateShipCoordinates(ship);
        },
        canDrop: ({ ship }) => {
            return isShipValidAtThisPosition(ship);
        },
        collect: (monitor) => ({
            movingShip: monitor.getItem(),
            isPointerOver: monitor.isOver(),
            isLegalMove: monitor.canDrop(),
        }),
    });

    let shipObject = null;
    if (shipInCell) shipObject = { ship: shipInCell };
    if (isPointerOver && isLegalMove) shipObject = { ship: movingShip.ship, hovering: true };

    const isShipValidAtThisPosition = (ship) => {
        const { shipName, layout, length } = ship;
        const shipCoordinates = buildShipCoords({ point, layout, length });
        const otherShipCoords = { ...shipCoords };
        delete otherShipCoords[shipName];
        return isShipPositionValid(shipCoordinates, otherShipCoords);
    };

    const updateShipCoordinates = (ship) => {
        const { shipName, layout, length } = ship;
        const shipCoordinates = buildShipCoords({ point, layout, length });
        const newShipCoords = { ...shipCoords, [shipName]: shipCoordinates };
        handleShipCoordsChange(newShipCoords);
    };

    const onShipRotate = () => {
        const { layout } = shipObject.ship;
        const newShipObject = { ...shipObject.ship, layout: layout === 'horizontal' ? 'vertical' : 'horizontal' };
        if (isShipValidAtThisPosition(newShipObject)) updateShipCoordinates(newShipObject);
    };

    return <Cell ref={drop} {...props}>
        {shipObject
        && <PlayerShip
            ship={shipObject.ship}
            onShipRotate={onShipRotate}
            hovering={shipObject.hovering}
        />}
    </Cell>;
};

export default CellWithShipHandling;
