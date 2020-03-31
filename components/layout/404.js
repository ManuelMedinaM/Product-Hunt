import React from 'react';
import styled from '@emotion/styled';


const Error = styled.h1`
    margin-top:5rem;
    text-align:center;
`

const Error404 = () => {
    return (
        <Error>
            Producto no existente
        </Error>
    );
};

export default Error404;