import React, { useRef, useState, useEffect } from 'react';
import { MdLoop } from "react-icons/md";
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
    border-bottom: 1.5px solid #333;
`;

const Button = styled.button`
    height: 40px;
    width: 100px;
    padding: 0;
    text-decoration: none;
    border: 1.5px solid #333;
    border-radius: 5px;
    background-color: transparent;
    outline: none;

    transition-duration: 0.1s;
    &:hover {
        transform: translate(0, -1px);
        box-shadow: 0 1px 2px #BBB;
    }
    &:active {
        transform: translate(0, 1px);
        box-shadow: 0 1px 2px 1px #999;
    }
`;

const Game = () => {
    const [playerShipCoords, setPlayerShipCoords] = useState(generateRandomShipPositions(10));
    const [enemyBoardState, setEnemyBoardState] = useState(generateGridOfObjects(10));
    const [playerBoardState, setPlayerBoardState] = useState(generateGridOfObjects(10));
    const [playerType, setPlayerType] = useState();
    const [enemySunkShipCoords, setEnemySunkShipCoords] = useState({});
    const [headerMessage, setHeaderMessage] = useState('Place your battleships!');
    const [isGameInProgress, setIsGameInProgress] = useState(false);

    const startGame = () => {
        socket.emit('startGame', { gameID: 1,
            shipCoords: playerShipCoords,
        });
    };

    const randomizeShipPos = () => {
        setPlayerShipCoords(generateRandomShipPositions(10));
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
            setHeaderMessage('Waiting for opponent...');
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
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Board
                            areShipsMovable={!isGameInProgress}
                            shipCoords={playerShipCoords}
                            board={playerBoardState}
                            handleShipCoordsChange={setPlayerShipCoords}
                        />
                        <span onClick={() => randomizeShipPos()} style={{ display: 'flex', justifyContent: 'center' }}>
                            <MdLoop style={{ fontSize: '1.5em' }} /> Randomize Ships
                        </span>
                    </div>
                </div>
                <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', padding: 25 }}>
                    <span>{headerMessage}</span>
                    {!isGameInProgress && <Button onClick={startGame}>Start Game</Button>}
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
