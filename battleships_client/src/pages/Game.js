import React, { useState, useEffect } from 'react';
import { MdLoop } from 'react-icons/md';
import io from 'socket.io-client';
import styled from '@emotion/styled';
import Board from '../components/Board';
import Header from '../components/Header';

import { generateGridOfObjects } from '../utils';
import generateRandomShipPositions from '../utils/generateRandomShipPositions';

const socket = io('http://localhost:8080');

const FlexDiv = styled.div`
    display: flex;
`;

const RandomizeShipButton = styled.button`
    display: flex;
    align-items: center;

    text-decoration: none;
    background-color: transparent;
    outline: none;
    border: none;

    transition: ease-in 0.1s;
    &:hover:enabled {
        color: #6378ff;
        transform: translate(0, -1px);
    }

    &:active {
        transform: translate(0, 1px);
    }
`;

const Button = styled.button`
    height: 35px;
    width: 100px;
    padding: 0;
    text-decoration: none;
    border: 1.5px solid #333;
    border-radius: 5px;
    background-color: transparent;
    outline: none;

    transition: ease-in 0.1s;
    &:hover:enabled {
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
    const [hasGameEnded, setHasGameEnded] = useState(false);

    const startGame = () => {
        socket.emit('startGame', { gameID: 1,
            shipCoords: playerShipCoords,
        });
    };

    const resetGame = () => {
        setEnemyBoardState(generateGridOfObjects(10));
        setPlayerBoardState(generateGridOfObjects(10));
        setEnemySunkShipCoords({});
        setHasGameEnded(false);
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

            if (nextPlayer === playerType) {
                console.log('wat', nextPlayer, playerType);
                setHeaderMessage('Your turn');
            } else {
                console.log('wat', nextPlayer, playerType);
                setHeaderMessage('Opponent turn');
            }
        });

        socket.on('playerType', (msg) => {
            console.log(msg);
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
        if (!isGameInProgress) return false;
        socket.emit('attackPos', { attackPos: [x, y] });
    };

    if (!playerBoardState || !enemyBoardState) return null;

    return (
        <>
            <Header />
            <FlexDiv style={{ flexDirection: 'row', marginTop: 25 }}>
                <FlexDiv style={{ flex: 2, justifyContent: 'flex-end', padding: 25 }}>
                    <FlexDiv style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Board
                            areShipsMovable={!isGameInProgress}
                            shipCoords={playerShipCoords}
                            board={playerBoardState}
                            handleShipCoordsChange={setPlayerShipCoords}
                        />
                        <RandomizeShipButton disabled={isGameInProgress} style={{ marginTop: 15 }} onClick={() => randomizeShipPos()}>
                            <MdLoop style={{ fontSize: '1.5em' }} />
                            Randomize Ships
                        </RandomizeShipButton>
                    </FlexDiv>
                </FlexDiv>
                <FlexDiv style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', padding: 25 }}>
                    <span>{headerMessage}</span>
                    { hasGameEnded
                        ? <Button onClick={resetGame}> Play Again?</Button>
                        : <Button disabled={isGameInProgress} onClick={startGame}>Start Game</Button> }
                </FlexDiv>
                <FlexDiv style={{ flex: 2, padding: 25 }} >
                    <Board
                        areShipsMovable={false}
                        shipCoords={enemySunkShipCoords}
                        onCellAttack={onCellAttack}
                        board={enemyBoardState}
                    />
                </FlexDiv>
            </FlexDiv>
        </>
    );
};

export default Game;
