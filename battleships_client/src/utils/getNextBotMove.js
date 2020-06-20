
// AI for the bot
// Logic :
// 1) randomly select a position to attack
// 2) if a ship is damaged, finish off the ship first
// 3) don't attack spots that make no sense ( e.g attacking 4-wide empty space when the only ship left is 5-wide )

import generateRandomNumber from './generateRandomNumber';

export default function (boardState) {
    let iterations = 0;
    while (iterations < 10000) {
        iterations++;

        const attackX = generateRandomNumber(9);
        const attackY = generateRandomNumber(9);
        const cell = boardState[attackY][attackX];
        if (!cell.hit) { // already hit
            return [attackX, attackY];
        }
    }
}
