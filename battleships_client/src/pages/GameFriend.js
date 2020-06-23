import React from 'react';
import { useGamePlayerLogic, Game } from '../components';

const GameFriend = () => {
    const props = useGamePlayerLogic();

    return (
        <Game {...props} />
    );
};

export default GameFriend;
