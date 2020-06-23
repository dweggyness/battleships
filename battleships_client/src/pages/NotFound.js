import React, { useState } from 'react';
import styled from '@emotion/styled';
import { FaRegSadTear } from 'react-icons/fa';
import { Redirect } from 'react-router-dom';
import { Header } from '../components';

const Layout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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

const NotFound = () => {
    const [clickedRedirect, setClickedRedirect] = useState(false);

    if (clickedRedirect) return <Redirect to={'/'} />;

    return (
        <>
            <Header />
            <Layout>
                <FaRegSadTear style={{ marginTop: '10%', fontSize: '6em' }} />
                <p>Page not found! Press the button to go home. </p>
                <Button onClick={() => setClickedRedirect(true)}>Home</Button>
            </Layout>
        </>
    );
};

export default NotFound;
