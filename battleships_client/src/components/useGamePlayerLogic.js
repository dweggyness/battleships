import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import io from 'socket.io-client';

import { generateGridOfObjects } from '../utils';
import generateRandomShipPositions from '../utils/generateRandomShipPositions';

const socket = io('http://localhost:8080');

const useGamePlayerLogic = () => {
    const [playerShipCoords, setPlayerShipCoords] = useState(generateRandomShipPositions(10));
    const [enemyBoardState, setEnemyBoardState] = useState(generateGridOfObjects(10));
    const [playerBoardState, setPlayerBoardState] = useState(generateGridOfObjects(10));
    const [playerType, setPlayerType] = useState();
    const [currentPlayerTurn, setCurrentPlayerTurn] = useState();
    const [enemySunkShipCoords, setEnemySunkShipCoords] = useState({});
    const [headerMessage, setHeaderMessage] = useState('Place your battleships!');
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isGameInProgress, setIsGameInProgress] = useState(false);
    const [hasGameEnded, setHasGameEnded] = useState(false);

    const { id } = useParams();
    let gameURL = useLocation();
    gameURL = `localhost:3000${gameURL.pathname}`;

    const startGame = () => {
        setIsPlayerReady(true);
        setHeaderMessage('Waiting for opponent...');
        socket.emit('startGame', { gameID: id,
            shipCoords: playerShipCoords,
        });
    };

    const resetGame = () => {
        setEnemyBoardState(generateGridOfObjects(10));
        setPlayerBoardState(generateGridOfObjects(10));
        setEnemySunkShipCoords({});
        setHasGameEnded(false);
        setIsGameInProgress(false);
        setIsPlayerReady(false);
        setHeaderMessage('Place your ships!');
    };

    const randomizeShipPos = () => {
        setPlayerShipCoords(generateRandomShipPositions(10));
    };

    useEffect(() => {
        socket.on('gameStream', (msg) => {
            const { player, nextPlayer, attackPos, result, winner } = msg;

            console.log(msg);

            if (player === playerType) {
                setEnemyBoardState((prevBoardState) => {
                    const tempBoardState = [...prevBoardState];
                    const prevData = { ...tempBoardState[attackPos[1]][attackPos[0]] };

                    if (result.result === 'Hit') tempBoardState[attackPos[1]][attackPos[0]] = { ...prevData, hit: 'ship' };
                    else tempBoardState[attackPos[1]][attackPos[0]] = { ...prevData, hit: 'miss' };

                    if (result.ship) { // sunk ship
                        setEnemySunkShipCoords((prevCoords) => ({ ...prevCoords, [result.ship]: result.shipCoords }));
                    }
                    return tempBoardState;
                });
            } else if (player) {
                setPlayerBoardState((prevBoardState) => {
                    const tempBoardState = [...prevBoardState];
                    const prevData = { ...tempBoardState[attackPos[1]][attackPos[0]] };

                    if (result.result === 'Hit') tempBoardState[attackPos[1]][attackPos[0]] = { ...prevData, hit: 'ship' };
                    else tempBoardState[attackPos[1]][attackPos[0]] = { ...prevData, hit: 'miss' };

                    return tempBoardState;
                });
            }

            if (winner) {
                setHasGameEnded(true);
                console.log('Winner get!');
                if (winner === playerType) setHeaderMessage('Victory!');
                else setHeaderMessage('You lost!');
            }

            if (nextPlayer) {
                if (nextPlayer === playerType) {
                    setIsGameInProgress(true);
                    setHeaderMessage('Your turn');
                    setCurrentPlayerTurn('Player');
                } else {
                    setIsGameInProgress(true);
                    setHeaderMessage('Opponent turn');
                    setCurrentPlayerTurn('Opponent');
                }
            }
        });

        socket.on('playerType', (msg) => {
            console.log(msg);
            setPlayerType(msg.player);
        });

        socket.on('errorMessage', (msg) => {
            console.log(msg);
        });

        return () => {
            socket.off('gameStream');
            socket.off('playerType');
            socket.off('errorMessage');
        };
    }, [playerShipCoords, playerType]);

    const onCellAttack = (x, y) => {
        console.log('uwu');
        if (!isGameInProgress) return false;
        socket.emit('attackPos', { attackPos: [x, y] });
    };

    if (!playerBoardState || !enemyBoardState) return null;

    return {
        isGameInProgress,
        playerShipCoords,
        playerBoardState,
        setPlayerShipCoords,
        isPlayerReady,
        headerMessage,
        hasGameEnded,
        resetGame,
        startGame,
        currentPlayerTurn,
        enemySunkShipCoords,
        onCellAttack,
        enemyBoardState,
        gameURL,
        randomizeShipPos,
    };
};

export default useGamePlayerLogic;
