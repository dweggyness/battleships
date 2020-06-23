import { useState, useEffect } from 'react';

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
        console.log('hello', destroyedShipCoords);
        console.log('prev', hitCoordsWithShip);
        console.log('new', hitCoordsWithShip.filter((point) => !pointExistsInArray(point, destroyedShipCoords)));
        setHitCoordsWithShip((prevArr) => prevArr.filter((point) => !pointExistsInArray(point, destroyedShipCoords)));
    };

    const makeBotNextMove = (boardState) => {
        if (hitCoordsWithShip.length !== 0) { // a ship is hit, but not finished off
            while (true) {
                // randomly pick a known hit point
                const index = generateRandomNumber(hitCoordsWithShip.length - 1);
                const anchorPoint = hitCoordsWithShip[index];
                console.log(anchorPoint);

                // randomly pick a direction ^ > v <
                const direction = generateRandomNumber(3);
                let attackCoord;
                if (direction === 0) attackCoord = [anchorPoint[0], anchorPoint[1] + 1];
                if (direction === 1) attackCoord = [anchorPoint[0] + 1, anchorPoint[1]];
                if (direction === 2) attackCoord = [anchorPoint[0], anchorPoint[1] - 1];
                if (direction === 3) attackCoord = [anchorPoint[0] - 1, anchorPoint[1]];

                // check if position is valid
                if (isPointWithinBounds(attackCoord)) {
                    if (!pointExistsInArray(attackCoord, hitCoordsWithShip)) {
                        const cell = boardState[attackCoord[1]][attackCoord[0]];
                        if (!cell.hit) { // not previously hit
                            console.log('attack', attackCoord);
                            console.log(cell);
                            console.log(hitCoordsWithShip);
                            return [attackCoord[0], attackCoord[1]];
                        }
                    }
                }
            }
        } else { // randomly attack a location
            while (true) {
                const attackX = generateRandomNumber(9);
                const attackY = generateRandomNumber(9);
                const cell = boardState[attackY][attackX];
                if (!cell.hit) { // not hit yet
                    return [attackX, attackY];
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
