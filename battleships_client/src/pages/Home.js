import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { GiBroadsword } from 'react-icons/gi';
import { RiRobotLine } from 'react-icons/ri';
import styled from '@emotion/styled';
import generateRandomNumber from '../utils/generateRandomNumber';
import Header from '../components/Header';
import Card from '../components/Card';

const CardLayout = styled.div`
    display: flex;
    flex-direction: row;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const CardContainer = styled.div`
    display: flex;
    flex: 1;
    margin: 10vh 0;
    padding: 0;
    align-items: center;
    justify-content: center;

    @media (max-width: 768px) {
        &:last-child {
            margin-top: 0;
        }
    }
`;

const Home = () => {
    const [clickedPlayBot, setClickedPlayBot] = useState(false);
    const [clickedPlayFriend, setClickedPlayFriend] = useState(false);

    if (clickedPlayBot) {
        return <Redirect to={'/game/bot'} />;
    }

    if (clickedPlayFriend) {
        const randomGameID = generateRandomNumber(10000000);
        return <Redirect to={`/game/${randomGameID}`} />;
    }

    return (
        <>
            <Header />
            <CardLayout>
                <CardContainer>
                    <Card
                        onButtonClick={() => setClickedPlayBot(true)}
                        Icon={RiRobotLine}
                        title={'Play against BOT'}
                        text={'Practice your skills against an AI opponent!'}
                    />
                </CardContainer>
                <CardContainer>
                    <Card
                        onButtonClick={() => setClickedPlayFriend(true)}
                        Icon={GiBroadsword}
                        title={'Play against friend'}
                        text={'Classic Battleships against a friend, with a rapid-fire twist! Fire as many times as the number of ships you have still floating.'}
                    />
                </CardContainer>
            </CardLayout>
        </>
    );
};

export default Home;
