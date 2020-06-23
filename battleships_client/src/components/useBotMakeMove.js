import { useState } from 'react';

import generateRandomNumber from '../utils/generateRandomNumber';
import isPointWithinBounds from '../utils/isPointWithinBounds';
import pointExistsInArray from '../utils/pointExistsInArray';

const useBotMakeMove = () => {
    const [hitCoordsWithShip, setHitCoordsWithShip] = useState([]);

    const updateBotAIHitShip = (coordinate) => {
        const oldArr = [...hitCoordsWithShip];
        oldArr.push(coordinate);
        setHitCoordsWithShip(oldArr);
    };

    const updateBotAIDestroyShip = (destroyedShipCoords) => {
        setHitCoordsWithShip((prevArr) => prevArr.filter((point) => !pointExistsInArray(point, destroyedShipCoords)));
    };

    const isCoordinateValid = (coordinate, boardState) => {
        if (isPointWithinBounds(coordinate)) {
            const cell = boardState[coordinate[1]][coordinate[0]];
            if (!cell.hit) return true;
        }
        return false;
    };

    const checkVerticalEmptySpace = (coordinate, boardState) => {
        let emptySpace = 1; // current coordinate
        let newCoord = coordinate;
        while (true) { // check NORTH, step north until impossible
            newCoord = [newCoord[0], newCoord[1] + 1];
            if (isCoordinateValid(newCoord, boardState)) {
                emptySpace++;
            } else break;
        }

        newCoord = coordinate;
        while (true) { // check SOUTH, step until impossible
            newCoord = [newCoord[0], newCoord[1] - 1];
            if (isCoordinateValid(newCoord, boardState)) {
                emptySpace++;
            } else break;
        }
        return emptySpace;
    };

    const checkHorizontalEmptySpace = (coordinate, boardState) => {
        let emptySpace = 1; // current coordinate
        let newCoord = coordinate;
        while (true) { // check EAST, step east until impossible
            newCoord = [newCoord[0] + 1, newCoord[1]];
            if (isCoordinateValid(newCoord, boardState)) {
                emptySpace++;
            } else break;
        }

        newCoord = coordinate;
        while (true) { // check WEST, step west until impossible
            newCoord = [newCoord[0] - 1, newCoord[1]];
            if (isCoordinateValid(newCoord, boardState)) {
                emptySpace++;
            } else break;
        }
        return emptySpace;
    };

    const makeBotNextMove = (boardState) => {
        // a ship is hit, but not finished off
        if (hitCoordsWithShip.length !== 0) {
            while (true) {
                // try to attack in the direction of any possible lines
                // compare each coordinate to each other and attempt to find lines
                if (hitCoordsWithShip.length >= 2) {
                    let attackCoord;
                    const prevHitShipCoords = [...hitCoordsWithShip];
                    prevHitShipCoords.forEach((anchor, i1) => {
                        prevHitShipCoords.forEach((coord, i2) => {
                            if (anchor[0] - coord[0] === 1 && anchor[1] - coord[1] === 0) { // north
                                const newCoord = [anchor[0] + 1, anchor[1]];
                                if (isCoordinateValid(newCoord, boardState)) attackCoord = newCoord;
                            } else if (anchor[0] - coord[0] === 0 && anchor[1] - coord[1] === 1) { // east
                                const newCoord = [anchor[0], anchor[1] + 1];
                                if (isCoordinateValid(newCoord, boardState)) attackCoord = newCoord;
                            } else if (anchor[0] - coord[0] === -1 && anchor[1] - coord[1] === 0) { // south
                                const newCoord = [anchor[0] - 1, anchor[1]];
                                if (isCoordinateValid(newCoord, boardState)) attackCoord = newCoord;
                            } else if (anchor[0] - coord[0] === 0 && anchor[1] - coord[1] === -1) { // west
                                const newCoord = [anchor[0], anchor[1] - 1];
                                if (isCoordinateValid(newCoord, boardState)) attackCoord = newCoord;
                            }
                        });
                    });

                    if (attackCoord) return attackCoord;
                }

                // otherwise, randomly pick a known hit point, and attack a random direction
                const index = generateRandomNumber(hitCoordsWithShip.length - 1);
                const anchorPoint = hitCoordsWithShip[index];

                const direction = generateRandomNumber(3);
                let attackCoord;
                if (direction === 0) attackCoord = [anchorPoint[0], anchorPoint[1] + 1];
                if (direction === 1) attackCoord = [anchorPoint[0] + 1, anchorPoint[1]];
                if (direction === 2) attackCoord = [anchorPoint[0], anchorPoint[1] - 1];
                if (direction === 3) attackCoord = [anchorPoint[0] - 1, anchorPoint[1]];

                if (isCoordinateValid(attackCoord, boardState)) {
                    return [attackCoord[0], attackCoord[1]];
                }
            }
        } else { // randomly attack a location
            while (true) {
                const attackX = generateRandomNumber(9);
                const attackY = generateRandomNumber(9);
                const cell = boardState[attackY][attackX];
                if (!cell.hit) { // not hit yet
                    const vertEmptySpace = checkVerticalEmptySpace([attackX, attackY], boardState);
                    const horiEmptySpace = checkHorizontalEmptySpace([attackX, attackY], boardState);
                    if (vertEmptySpace > 1 || horiEmptySpace > 1) return [attackX, attackY];
                }
            }
        }
    };

    return {
        makeBotNextMove,
        updateBotAIHitShip,
        updateBotAIDestroyShip,
    };
};

export default useBotMakeMove;
