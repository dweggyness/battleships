import React from 'react';
import { useGameBotLogic, Game } from '../components';

const GameFriend = () => {
    const props = useGameBotLogic();

    return (
        <Game {...props} />
    );
};

export default GameFriend;
