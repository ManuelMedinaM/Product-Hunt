import React, {useContext} from 'react';
import Buscar from '../ui/Buscar'
import Navegacion from './Navegacion';
import Link from 'next/link';
import styled from '@emotion/styled';
import {FirebaseContext} from '../../firebase';

import Boton from '../ui/Boton'


const ContenedorHeader = styled.div`
    max-width:1200px;
    width: 95%;
    margin: 0 auto;
    @media(min-width:768px){
        display: flex;
        justify-content:space-between;
    }
`
const Heading = styled.header`
    border-bottom: 2px solid #e1e1e1;
    padding: 1rem 0;
`

const Logo = styled.a`
    color: var(--naranja);
    font-size: 4rem;
    line-height: 0;
    font-weight: 700;
    font-family: 'Roboto Slab', serif;
    margin-right: 2rem;
`;

const ContenedorNav = styled.div`
    display: flex;
    align-items: center;
`;

const Nombre = styled.p`
    margin-right: 2rem;
`
const Header = () => {
    const {usuario,firebase} = useContext(FirebaseContext);
    return (
        <Heading>
            <ContenedorHeader>
                <ContenedorNav>
                    <Link href="/">
                            <Logo>
                                P
                            </Logo>
                    </Link>

                    <Buscar/>
                    <Navegacion/>
                </ContenedorNav>
                <ContenedorNav>
                   {usuario ? (
                       <>
                            <Nombre
                            >hola: {usuario.displayName}
                            </Nombre>
                            <Boton bgColor="true"
                                onClick={()=>firebase.cierraSesion()}
                            >cerrrar sesion
                            </Boton>
                        </>
                   ): (
                        <>
                            <Link href="/login">
                                    <Boton bgColor="true">login</Boton>
                                </Link>
                                <Link href="/crear-cuenta">
                                    <Boton>crear cuenta</Boton>
                            </Link>
                        </>
                   )}
                </ContenedorNav>
            </ContenedorHeader>
        </Heading>
    );
};

export default Header;