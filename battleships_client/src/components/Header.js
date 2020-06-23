import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import Logo from '../assets/icon.png';

const HeaderBar = styled.div`
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1.5px solid #333;
    font-size: 1.25em;
    font-weight: 500;

    white-space: nowrap;

    @media (max-width: 768px) {
        font-size: 1em;
        height: 70px;
    }
`;

const Header = () => (
    <HeaderBar>
        <Link style={{ height: '100%', textDecoration: 'none', alignItems: 'center', display: 'flex', flexDirection: 'row' }} to="/">
            <img style={{ margin: '10%', height: '90%' }} src={Logo} alt='battleship logo' />
            Waterbound Fighting Vessels
        </Link>
    </HeaderBar>
);

export default Header;
