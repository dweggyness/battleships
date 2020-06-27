import React, { useState, useEffect, useRef } from 'react';
import { FaRegCopy } from 'react-icons/fa';
import styled from '@emotion/styled';

const URLBox = styled.div`
    display: flex;
    align-items: center;
    background-color: white;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 250px;
    height: 30px;
    padding: 0px 5px;
    border: 1.5px solid black;
    border-radius: 5px 0 0 5px;
`;

const ClipBoardBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: 1.5px solid black;
    background-color: #FAFAFA;
    border-left: none;
    border-radius: 0 5px 5px 0;

    &:hover {
        * {
            transform: translate(0, -1px);
        }
    }

    &:active {
        * {
            transform: translate(0, 1px);
        }
    }
`;

const URLBoxComponent = (props) => {
    const { gameURL } = props;
    const [displayText, setDisplayText] = useState(gameURL);
    const timer = useRef();

    useEffect(() => {
        setDisplayText(gameURL);
    }, [gameURL]);

    const handleUserClickCopyTextButton = () => {
        navigator.clipboard.writeText(gameURL);
        setDisplayText('Copied!');

        clearTimeout(timer.current);
        timer.current = setTimeout(() => setDisplayText(gameURL), 1000);
    };

    return (
        <>
            <URLBox>
                {displayText}
            </URLBox>
            <ClipBoardBox onClick={handleUserClickCopyTextButton}>
                <FaRegCopy />
            </ClipBoardBox>
        </>
    );
};

export default URLBoxComponent;
