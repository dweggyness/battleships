import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import io from 'socket.io-client';

import { generateGridOfObjects, countRemainingShips, generateRandomShipPositions } from '../utils';

const useGamePlayerLogic = () => {
    const [playerShipCoords, setPlayerShipCoords] = useState(generateRandomShipPositions(10));
    const [enemyBoardState, setEnemyBoardState] = useState(generateGridOfObjects(10));
    const [playerBoardState, setPlayerBoardState] = useState(generateGridOfObjects(10));
    const [playerType, setPlayerType] = useState();
    const [lastPlayer, setLastPlayer] = useState();
    const [currentPlayerTurn, setCurrentPlayerTurn] = useState();
    const [shotsLeft, setShotsLeft] = useState(5);
    const [enemySunkShipCoords, setEnemySunkShipCoords] = useState({});
    const [headerMessage, setHeaderMessage] = useState('Place your battleships! \n\nDrag to move your ships, and tap on them to rotate the ship!');
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isGameInProgress, setIsGameInProgress] = useState(false);
    const [hasGameEnded, setHasGameEnded] = useState(false);
    const [socket] = useState(io(`${process.env.DOMAIN}:${process.env.PORT}`));

    console.log(process, process.env, process.env.DOMAIN, process.env.PORT);

    useEffect(() => {
        if (socket) return () => socket.disconnect();
    }, [socket]);

    const { id } = useParams();
    let gameURL = useLocation();
    gameURL = `${window.location.host}${gameURL.pathname}`;

    const startGame = () => {
        setIsPlayerReady(true);
        setShotsLeft(5);
        setHeaderMessage('Waiting for opponent...');
        socket.emit('startGame', { gameID: id,
            shipCoords: playerShipCoords,
        });
    };

    const resetGame = () => {
        socket.emit('playAgain', 'play again');
        setEnemyBoardState(generateGridOfObjects(10));
        setPlayerBoardState(generateGridOfObjects(10));
        setEnemySunkShipCoords({});
        setHasGameEnded(false);
        setIsGameInProgress(false);
        setIsPlayerReady(false);
        setCurrentPlayerTurn();
        setHeaderMessage('Place your battleships! \n\nDrag to move your ships, and tap on them to rotate the ship!');
    };

    const randomizeShipPos = () => {
        setPlayerShipCoords(generateRandomShipPositions(10));
    };

    useEffect(() => {
        socket.on('gameStream', (msg) => {
            console.log(msg);
            const { player, attackPos, result, winner } = msg;

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
                const { reason } = msg;
                setHasGameEnded(true);
                if (reason === 'victory') {
                    if (winner === playerType) setHeaderMessage('Victory! \n\n(☞ﾟヮﾟ)☞');
                    else setHeaderMessage('You lost! \n\n(╯°□°）╯︵ ┻━┻');
                } else {
                    setHeaderMessage('Opponent disconnected \n\n (┬┬﹏┬┬)');
                }
            }
        });

        socket.on('nextPlayer', (msg) => {
            const { nextPlayer } = msg;

            let shots = shotsLeft;
            if (nextPlayer === playerType) {
                if (nextPlayer !== lastPlayer) shots = countRemainingShips(playerShipCoords, playerBoardState);

                setIsGameInProgress(true);
                setHeaderMessage(`Your turn. \n\n${shots} 💣 shots left`);
                setCurrentPlayerTurn('Player');

                shots -= 1;
                setShotsLeft(shots);
            } else {
                if (nextPlayer !== lastPlayer) shots = 5 - Object.keys(enemySunkShipCoords).length;

                setIsGameInProgress(true);
                setHeaderMessage(`Opponent turn. \n\n${shots} 💣 shots left`);
                setCurrentPlayerTurn('Opponent');

                shots -= 1;
                setShotsLeft(shots);
            }

            setLastPlayer(nextPlayer);
        })

        socket.on('playerType', (msg) => {
            setPlayerType(msg.player);
        });

        socket.on('errorMessage', (msg) => {
            console.log('err', msg);
            // what am i supposed to do here lmao
            // if an error occurs that means my server is shit :(
        });

        return () => {
            socket.off('gameStream');
            socket.off('nextPlayer');
            socket.off('playerType');
            socket.off('errorMessage');
        };
    }, [shotsLeft, playerBoardState, lastPlayer, playerShipCoords, enemySunkShipCoords, playerType]);

    const onCellAttack = (x, y) => {
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
