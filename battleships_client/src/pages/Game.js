import React, { useRef, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import Board from '../components/Board';
import Logo from '../assets/icon.png';

import { generateGridOfObjects } from '../utils';
import generateRandomShipPositions from '../utils/generateRandomShipPositions';


const socket = io('http://localhost:8080');

const HeaderBar = styled.div`
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 2px solid #333;
`;

const Game = () => {
    const [playerShipCoords, setPlayerShipCoords] = useState(generateRandomShipPositions(10));
    const [enemyBoardState, setEnemyBoardState] = useState(generateGridOfObjects(10));
    const [playerBoardState, setPlayerBoardState] = useState(generateGridOfObjects(10));
    const [playerType, setPlayerType] = useState();
    const [enemySunkShipCoords, setEnemySunkShipCoords] = useState({});
    const [headerMessage, setHeaderMessage] = useState('Waiting for opponent...');
    const [isGameInProgress, setIsGameInProgress] = useState(false);

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

            console.log('msg', msg);
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

            if (winner === playerType) {
                setIsGameInProgress(false);
                console.log('Winner get!');
            }

            if (nextPlayer === playerType) {
                setHeaderMessage('Your turn!');
            } else {
                setHeaderMessage('Opponent turn');
            }
        });

        socket.on('playerType', (msg) => {
            setIsGameInProgress(true);
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
        socket.emit('attackPos', { attackPos: [x, y] });
    };

    if (!playerBoardState || !enemyBoardState) return null;

    return (
        <>
            <HeaderBar>
                <Link style={{ margin: 10, height: '100%', textDecoration: 'none', alignItems: 'center', display: 'flex', flexDirection: 'row' }} to="/">
                    <img style={{ margin: '10%', height: '90%' }} src={Logo} alt='battleship logo' />
                    Waterbound Fighting Vessels
                </Link>
            </HeaderBar>
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: 25 }}>
                <div style={{ display: 'flex', flex: 2, justifyContent: 'flex-end', padding: 25 }}>
                    <Board
                        areShipsMovable={!isGameInProgress}
                        shipCoords={playerShipCoords}
                        board={playerBoardState}
                        handleShipCoordsChange={handlePlayerShipCoordsChange}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', padding: 25 }}>
                    <span>{headerMessage}</span>
                    <button style={{ height: 50, width: 100 }} onClick={startGame}> Start Game</button>
                </div>
                <div style={{ flex: 2, padding: 25 }} >
                    <Board
                        areShipsMovable={false}
                        shipCoords={enemySunkShipCoords}
                        onCellAttack={onCellAttack}
                        board={enemyBoardState}
                    />
                </div>
            </div>
        </>
    );
};

export default Game;
