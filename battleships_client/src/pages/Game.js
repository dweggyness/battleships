import React from 'react';
import { MdLoop } from 'react-icons/md';
import styled from '@emotion/styled';
import useGamePlayerLogic from '../components/useGamePlayerLogic';
import URLBox from '../components/URLBox';
import Board from '../components/Board';
import Header from '../components/Header';

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

    &:active:enabled {
        transform: translate(0, 1px);
    }
`;

const URLBoxContainer = styled.div`
    position: absolute;
    padding: 15;
    border-radius: 5px;
    backgroundColor: white;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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

    &:active:enabled {
        transform: translate(0, 1px);
        box-shadow: 0 1px 2px 1px #999;
    }
`;

const Game = (props) => {
    const {
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
    } = useGamePlayerLogic();

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
                        <RandomizeShipButton disabled={isPlayerReady} style={{ marginTop: 15 }} onClick={() => randomizeShipPos()}>
                            <MdLoop style={{ fontSize: '1.5em' }} />
                            Randomize Ships
                        </RandomizeShipButton>
                    </FlexDiv>
                </FlexDiv>
                <FlexDiv style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', padding: 25 }}>
                    <p style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}>{headerMessage}</p>
                    { hasGameEnded
                        ? <Button onClick={resetGame}> Play Again?</Button>
                        : <Button disabled={isPlayerReady} onClick={startGame}>Start Game</Button> }
                </FlexDiv>
                <FlexDiv style={{ flex: 2, padding: 25 }} >
                    <div style={{ position: 'absolute' }}>
                        <div style={{ opacity: currentPlayerTurn === 'Player' ? 1.0 : 0.5 }}>
                            <Board
                                areShipsMovable={false}
                                shipCoords={enemySunkShipCoords}
                                onCellAttack={onCellAttack}
                                board={enemyBoardState}
                            />
                        </div>
                        { !isGameInProgress && <URLBoxContainer style={{ position: 'absolute', padding: 15, borderRadius: 5, backgroundColor: 'white', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <span>Copy and send this URL to your friend!</span>
                            <FlexDiv style={{ marginTop: 15 }}>
                                <URLBox gameURL={gameURL} />
                            </FlexDiv>
                        </URLBoxContainer> }
                    </div>
                </FlexDiv>
            </FlexDiv>
        </>
    );
};

export default Game;
