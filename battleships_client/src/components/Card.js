import React from 'react';
import styled from '@emotion/styled';

const Card = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    border: 2px solid #333333;
    background-color: #FBFBFB;
    border-radius: 15px 15px 0 0;

    min-height: 250px;
    width: 70%;

    @media (max-width: 768px) {
        width: 80%;
    }
`;

const Title = styled.span`
    font-weight: 500;
    font-size: 1.3em;
`;

const Button = styled.button`
    height: 35px;
    width: 100px;
    padding: 0;
    border: 1.5px solid #333;
    border-radius: 5px;
    background-color: white;
    font-family: 'Fira Sans';
    text-decoration: none;
    outline: none;

    transition: ease-in 0.1s;
    &:hover {
        transform: translate(0, -1px);
        box-shadow: 0 1px 2px #BBB;
    }

    &:active {
        transform: translate(0, 1px);
        box-shadow: 0 1px 2px 1px #999;
    }
`;

const CardComponent = (props) => {
    const { Icon, title, onButtonClick, text } = props;

    return (
        <Card>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 15 }}>
                <Icon style={{ fontSize: '3em' }}/>
                <Title style={{ marginTop: 15 }}>{title}</Title>
                <p style={{ padding: '0 25px', textAlign: 'center' }}>{text}</p>
            </div>
            <Button onClick={onButtonClick} style={{ marginBottom: 15 }}>Play</Button>
        </Card>
    );
};

export default CardComponent;
