import React, { useRef, useState, useEffect } from 'react';
import io from 'socket.io-client';
import Board from '../components/Board';

const socket = io('http://localhost:8080');

const Game = () => {
    const [playerShipCoords, setPlayerShipCoords] = useState({
        patrol: [[1, 1], [1, 2]],
        destroyer: [[1, 3], [1, 4], [1, 5]],
        submarine: [[5, 3], [4, 3], [4, 4]],
        battleship: [[3, 3], [4, 4], [5, 5], [3, 3]],
        carrier: [[3, 3], [4, 4], [5, 5], [3, 3], [4, 4]],
    });
    const [boardState, setBoardState] = useState();
    const [headerMessage, setHeaderMessage] = useState('Waiting for opponent...');
    const playerType = useRef();

    useEffect(() => {
        const temp = [];
        for (let y = 0; y < 10; y += 1) {
            const _temp = [];
            for (let x = 0; x < 10; x += 1) {
                _temp.push({ hit: null });
            }
            temp.push(_temp);
        }
        setBoardState(temp);
    }, []);

    useEffect(() => {
        socket.emit('startGame', { gameID: 1,
            shipCoords: playerShipCoords,
        });
    }, []);

    useEffect(() => {
        socket.on('gameStream', (msg) => {
            const { player, nextPlayer, attackPos, result, winner } = msg;
            console.log(msg, nextPlayer, playerType.current);

            if (player === playerType.current) {
                setBoardState((prevBoardState) => {
                    const tempBoardState = [...prevBoardState];
                    if (result.result === 'Hit') tempBoardState[attackPos[1]][attackPos[0]] = { hit: 'ship' };
                    else tempBoardState[attackPos[1]][attackPos[0]] = { hit: 'miss' };
                    if (result.ship) { // sunk ship
                        playerShipCoords[result.ship].forEach((shipCoord) => {
                            tempBoardState[shipCoord[1]][shipCoord[0]] = { sunk: true };
                        });
                    }
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

    if (!boardState) return null;

    return (
        <div>
            <Board onCellAttack={onCellAttack} board={boardState}/>
            <Board onCellAttack={onCellAttack} board={boardState}/>
            <p>Game PAGE</p>
            <span>{headerMessage}</span>
        </div>
    );
};

export default Game;
