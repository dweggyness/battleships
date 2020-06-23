import React from 'react';
import styled from '@emotion/styled';
import XCross from './XCross';

const StyledCell = styled.td`
    border: 1px solid #7e7e7e;
    background-color: transparent;
    width: 10vw;
    max-width: 2em;
    height: 2em;
    padding: 0;
    transition-duration: 0.15s;
`;

const Cell = React.forwardRef((props, ref) => {
    const { onClick, hitState } = props;
    return <StyledCell
        ref={ref}
        onClick={onClick}
    >
        {hitState === 'ship' && <XCross color={'rgb(255, 55, 55)'} />}
        {hitState === 'miss' && <XCross color={'rgb(150, 150, 150)'} />}
        {props.children}
    </StyledCell>;
});

Cell.displayName = 'Cell';
export default Cell;
