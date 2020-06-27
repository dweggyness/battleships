import React from 'react';
import { MdLoop } from 'react-icons/md';
import styled from '@emotion/styled';
import { URLBox, Board, Header } from '.';

const FlexDiv = styled.div`
    display: flex;
`;

const RandomizeShipButton = styled.button`
    display: flex;
    align-items: center;
    margin-top: 25px;

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

    @media (max-width: 768px) {
        margin-top: 0px;
        margin-bottom: 10px;
    }
`;

const Layout = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 25px;
    align-items: center;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const PlayerBoardContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    @media (max-width: 768px) {
        flex-direction: column-reverse;
    }
`;

const GameInfoContainer = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    align-self: stretch;
    padding: 25px;

    @media (max-width: 768px) {
        padding: 0px 25px;
    }
`;

const EnemyBoardContainer = styled.div`
    display: flex;
    align-self: flex-start;
    padding: 15px;
    flex: 2;

    @media (max-width: 768px) {
        align-self: center;
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

    &:disabled {
        border-color: #bbbbbb;
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
    } = props;

    return (
        <>
            <Header />
            <Layout>
                <FlexDiv style={{ flex: 2, justifyContent: 'flex-end', padding: 15 }}>
                    <PlayerBoardContainer>
                        <Board
                            areShipsMovable={!isPlayerReady && !hasGameEnded}
                            shipCoords={playerShipCoords}
                            board={playerBoardState}
                            handleShipCoordsChange={setPlayerShipCoords}
                        />
                        <RandomizeShipButton disabled={isPlayerReady} onClick={() => randomizeShipPos()}>
                            <MdLoop style={{ fontSize: '1.5em' }} />
                            Randomize Ships
                        </RandomizeShipButton>
                    </PlayerBoardContainer>
                </FlexDiv>
                <GameInfoContainer>
                    <p style={{ margin: '0 0 10px 0', textAlign: 'center', whiteSpace: 'pre-wrap' }}>{headerMessage}</p>
                    { hasGameEnded
                        ? <Button onClick={resetGame}> Play Again?</Button>
                        : <Button disabled={isPlayerReady} onClick={startGame}>Start Game</Button> }
                </GameInfoContainer>
                <EnemyBoardContainer>
                    <div style={{ position: 'relative' }}>
                        <div style={{ opacity: currentPlayerTurn === 'Player' ? 1.0 : 0.5 }}>
                            <Board
                                areShipsMovable={false}
                                shipCoords={enemySunkShipCoords}
                                onCellAttack={onCellAttack}
                                board={enemyBoardState}
                            />
                        </div>
                        { !isGameInProgress && gameURL && <URLBoxContainer style={{ position: 'absolute', padding: 15, borderRadius: 5, backgroundColor: 'white', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <span>Copy and send this URL to your friend!</span>
                            <FlexDiv style={{ marginTop: 15 }}>
                                <URLBox gameURL={gameURL} />
                            </FlexDiv>
                        </URLBoxContainer> }
                    </div>
                </EnemyBoardContainer>
            </Layout>
        </>
    );
};

export default Game;
