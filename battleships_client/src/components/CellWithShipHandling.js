import React from 'react';
import { useDrop } from 'react-dnd';
import { isShipPositionValid, buildShipCoords } from '../utils';
import Battleship from './Battleship';
import Cell from './Cell';

const CellWithShipHandling = (props) => {
    const { areShipsMovable = false, handleShipCoordsChange = () => {}, point, sunk, shipInCell, shipCoords } = props;
    const [{ isPointerOver, isLegalMove, hoveringShip }, drop] = useDrop({
        accept: 'ship',
        drop: ({ ship }) => {
            updateShipCoordinates(ship);
        },
        canDrop: ({ ship }) => {
            if (!areShipsMovable) return false;
            return isShipValidAtThisPosition(ship);
        },
        collect: (monitor) => ({
            hoveringShip: monitor.getItem(),
            isPointerOver: monitor.isOver(),
            isLegalMove: monitor.canDrop(),
        }),
    });

    let shipObject = null;
    if (shipInCell) shipObject = { ship: shipInCell };
    if (isPointerOver && isLegalMove) shipObject = { ship: hoveringShip.ship, hovering: true };

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

    const handleShipRotate = () => {
        const { layout } = shipObject.ship;
        const newShipObject = { ...shipObject.ship, layout: layout === 'horizontal' ? 'vertical' : 'horizontal' };
        if (isShipValidAtThisPosition(newShipObject)) updateShipCoordinates(newShipObject);
    };

    return <Cell ref={drop} {...props}>
        {shipObject
        && <Battleship
            ship={shipObject.ship}
            sunk={sunk}
            handleShipRotate={handleShipRotate}
            areShipsMovable={areShipsMovable}
            hovering={shipObject.hovering}
        />}
    </Cell>;
};

export default CellWithShipHandling;
