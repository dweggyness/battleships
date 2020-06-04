import React, { useRef, useState, useEffect } from 'react';
import io from 'socket.io-client';
import Board from '../components/Board';
import { generateGridOfObjects } from '../utils';
import generateRandomShipPositions from '../utils/generateRandomShipPositions';


const socket = io('http://localhost:8080');

const Game = () => {
    const [playerShipCoords, setPlayerShipCoords] = useState(generateRandomShipPositions(10));
    const [enemyBoardState, setEnemyBoardState] = useState(generateGridOfObjects(10));
    const [playerBoardState, setPlayerBoardState] = useState(generateGridOfObjects(10));
    const [enemySunkShipCoords, setEnemySunkShipCoords] = useState({});
    const [headerMessage, setHeaderMessage] = useState('Waiting for opponent...');
    const playerType = useRef();

    const startGame = () => {
        socket.emit('startGame', { gameID: 1,
            shipCoords: playerShipCoords,
        });
    };

    const handlePlayerShipCoordsChange = (newCoords) => {
        setPlayerShipCoords({ ...newCoords });
    };

    useEffect(() => {
        socket.on('gameStream', (msg) => {
            const { player, nextPlayer, attackPos, result, winner } = msg;
            console.log(msg, nextPlayer, playerType.current);

            if (player === playerType.current) {
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

            if (winner === playerType.current) {
                console.log('Winner get!');
            }

            if (nextPlayer === playerType.current) {
                setHeaderMessage('Your turn!');
            } else {
                setHeaderMessage('Opponent turn');
            }
        });

        socket.on('playerType', (msg) => {
            console.log('d', msg);
            playerType.current = msg.player;
        });

        socket.on('errorMessage', (msg) => {
            console.log(msg);
        });

        return () => {
            socket.off('gameStream');
            socket.off('playerType');
            socket.off('errorMessage');
        };
    }, [playerShipCoords]);

    const onCellAttack = (x, y) => {
        console.log([x, y]);
        socket.emit('attackPos', { attackPos: [x, y] });
    };

    if (!playerBoardState || !enemyBoardState) return null;

    return (
        <div>
            <Board
                areShipsMovable={true}
                shipCoords={playerShipCoords}
                board={playerBoardState}
                handleShipCoordsChange={handlePlayerShipCoordsChange}
            />
            <div style={{ height: '50px' }}></div>
            <span>{headerMessage}</span>
            <Board
                shipCoords={enemySunkShipCoords}
                onCellAttack={onCellAttack}
                board={enemyBoardState}
            />
            <p>Game PAGE</p>
            <button style={{ height: 50, width: 100 }} onClick={startGame}> Start the Game</button>
        </div>
    );
};

export default Game;
