import React from 'react';
import styled from '@emotion/styled';

const Cross = styled.span`
    position: absolute;
    padding: 1em;
    overflow: hidden;
    &:before, &:after {
        position: absolute;
        content: '';
        background: ${(props) => props.color};
        width: 100%;
        height: 0.1em;
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
    }
    &:after {
        -webkit-transform: rotate(45deg);    
        transform: rotate(45deg)
    }
`;

const XCross = (props) => {
    const { color } = props;
    return <Cross color={color} />;
};

export default XCross;
