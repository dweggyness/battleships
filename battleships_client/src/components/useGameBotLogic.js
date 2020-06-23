import { useState, useEffect } from 'react';

import { generateGridOfObjects } from '../utils';
import getNextBotMove from '../utils/getNextBotMove';
import pointExistsInArray from '../utils/pointExistsInArray';
import countRemainingShips from '../utils/countRemainingShips';
import generateRandomShipPositions from '../utils/generateRandomShipPositions';
import isShipSunk from '../utils/isShipSunk';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const useGamePlayerLogic = () => {
    const [playerShipCoords, setPlayerShipCoords] = useState(generateRandomShipPositions(10));
    const [enemyShipCoords, setEnemyShipCoords] = useState(generateRandomShipPositions(10));
    const [enemyBoardState, setEnemyBoardState] = useState(generateGridOfObjects(10));
    const [playerBoardState, setPlayerBoardState] = useState(generateGridOfObjects(10));
    const [currentPlayerTurn, setCurrentPlayerTurn] = useState();
    const [shotsLeft, setShotsLeft] = useState();
    const [enemySunkShipCoords, setEnemySunkShipCoords] = useState({});
    const [headerMessage, setHeaderMessage] = useState('Place your battleships! \n\nDrag to move your ships, and tap on them to rotate the ship!');
    const [isGameInProgress, setIsGameInProgress] = useState(false);
    const [hasGameEnded, setHasGameEnded] = useState(false);

    useEffect(() => {
        if (isGameInProgress && currentPlayerTurn === 'bot' && shotsLeft >= 1) {
            const performNextBotMove = async () => {
                const nextMove = getNextBotMove(playerBoardState);
                await sleep(150);
                botAttackPos(nextMove[0], nextMove[1]);
            };

            performNextBotMove();
        }
    }, [isGameInProgress, currentPlayerTurn, shotsLeft]);

    const startGame = () => {
        setCurrentPlayerTurn('Player');
        setShotsLeft(5);
        setIsGameInProgress(true);
    };

    const getAttackResult = (x, y, player) => {
        let result = { result: 'miss' };

        if (player === 'Player') {
            const shipNames = Object.keys(enemyShipCoords);
            shipNames.forEach((shipName) => {
                const curShipCoords = enemyShipCoords[shipName];

                // hit
                if (pointExistsInArray([x, y], curShipCoords)) {
                    const tempShipCoords = curShipCoords.filter((point) => !(point[0] === x && point[1] === y));
                    if (isShipSunk(tempShipCoords, enemyBoardState)) {
                        result = { result: 'Hit', ship: shipName, shipCoords: curShipCoords };
                    } else {
                        result = { result: 'Hit' };
                    }
                }
            });
        } else {
            const shipNames = Object.keys(playerShipCoords);
            shipNames.forEach((shipName) => {
                const curShipCoords = playerShipCoords[shipName];

                // hit
                if (pointExistsInArray([x, y], curShipCoords)) {
                    if (isShipSunk(curShipCoords, playerBoardState)) {
                        result = { result: 'Hit', ship: shipName, shipCoords: curShipCoords };
                    } else {
                        result = { result: 'Hit' };
                    }
                }
            });
        }

        return result;
    };

    const resetGame = () => {
        setEnemyBoardState(generateGridOfObjects(10));
        setPlayerBoardState(generateGridOfObjects(10));
        setEnemySunkShipCoords({});
        setEnemyShipCoords(generateRandomShipPositions(10));
        setHasGameEnded(false);
        setIsGameInProgress(false);
        setHeaderMessage('Place your battleships! \n\nDrag to move your ships, and tap on them to rotate the ship!');
    };

    const randomizeShipPos = () => {
        setPlayerShipCoords(generateRandomShipPositions(10));
    };

    const updatePlayerTurn = () => {
        if (shotsLeft <= 0) {
            if (currentPlayerTurn === 'Player') {
                setShotsLeft(5 - Object.keys(enemySunkShipCoords).length);
                setCurrentPlayerTurn('bot');
            } else {
                setShotsLeft(countRemainingShips(playerShipCoords, playerBoardState));
                setCurrentPlayerTurn('Player');
            }
        }

        if (currentPlayerTurn === 'Player') {
            setHeaderMessage(`Your turn. \n\n${shotsLeft} 💣 shots left`);
        } else {
            setHeaderMessage(`Opponent turn. \n\n${shotsLeft} 💣 shots left`);
        }
    }

    useEffect(() => {
        if (isGameInProgress && !hasGameEnded) {
            updatePlayerTurn();
        }
    }, [shotsLeft]);

    const handleWinner = (winner) => {
        setHasGameEnded(true);
        setIsGameInProgress(false);
        if (winner === 'Player') setHeaderMessage('Victory! \n\n(☞ﾟヮﾟ)☞');
        else setHeaderMessage('You lost! \n\n(╯°□°）╯︵ ┻━┻');
    };

    useEffect(() => {
        if (countRemainingShips(playerShipCoords, playerBoardState) <= 0) handleWinner('bot');
        if (countRemainingShips(enemyShipCoords, enemyBoardState) <= 0) handleWinner('Player');
    }, [enemyBoardState, playerBoardState]);


    const playerAttackPos = (x, y) => {
        const result = getAttackResult(x, y, 'Player');
        setEnemyBoardState((prevBoardState) => {
            const tempBoardState = [...prevBoardState];
            const prevData = { ...tempBoardState[y][x] };

            if (result.result === 'Hit') tempBoardState[y][x] = { ...prevData, hit: 'ship' };
            else tempBoardState[y][x] = { ...prevData, hit: 'miss' };

            if (result.ship) { // sunk ship
                setEnemySunkShipCoords((prevCoords) => ({ ...prevCoords, [result.ship]: result.shipCoords }));
            }
            return tempBoardState;
        });

        setShotsLeft((prev) => prev - 1);
    };

    const botAttackPos = (x, y) => {
        const result = getAttackResult(x, y, 'bot');
        setPlayerBoardState((prevBoardState) => {
            const tempBoardState = [...prevBoardState];
            const prevData = { ...tempBoardState[y][x] };

            if (result.result === 'Hit') tempBoardState[y][x] = { ...prevData, hit: 'ship' };
            else tempBoardState[y][x] = { ...prevData, hit: 'miss' };

            return tempBoardState;
        });

        setShotsLeft((prev) => prev - 1);
    };

    const onCellAttack = (x, y) => {
        if (enemyBoardState[y][x].hit) return false;
        if (!isGameInProgress || currentPlayerTurn !== 'Player') return false;
        playerAttackPos(x, y);
    };

    if (!playerBoardState || !enemyBoardState) return null;

    return {
        isGameInProgress,
        playerShipCoords,
        playerBoardState,
        setPlayerShipCoords,
        isPlayerReady: isGameInProgress || hasGameEnded,
        headerMessage,
        hasGameEnded,
        resetGame,
        startGame,
        currentPlayerTurn,
        enemySunkShipCoords,
        onCellAttack,
        enemyBoardState,
        randomizeShipPos,
    };
};

export default useGamePlayerLogic;
