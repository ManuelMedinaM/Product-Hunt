import React, { useState } from 'react';
import styled from '@emotion/styled';
import Router from 'next/router';


const ImputText = styled.input`
    border:1px solid #e1e1e1;
    padding: 1rem;
    min-width: 300px;
`

const ImputSubmit = styled.button`
    height: 3rem;
    width: 3rem;
    display: block;
    background-size: 3rem;
    background-image: url('/static/img/busqueda.png');
    background-repeat: no-repeat;
    position: absolute;
    right: 1rem;
    top: 5px;
    background-color: white;
    border: none;
    text-indent:-9999px;

    &:hover{
        cursor: pointer;
    }
`

const Formulario = styled.form`
    position: relative;
`


const Buscar = () => {
    const [busqueda, setBusqueda] = useState('');

    const buscarProducto = e=>{
        e.preventDefault();

        if(busqueda.trim() === '')return;

        //redireccion nar a /buscar
        Router.push({
            pathname:'/buscar',
            query:{q: busqueda}
        })

    }
    return (
        <Formulario
            onSubmit={buscarProducto}
        >
            <ImputText 
                type="text"
                placeholder="buscar Producto"
                onChange={e=>setBusqueda(e.target.value)}
            />
            <ImputSubmit type="submit">
                Buscar
            </ImputSubmit>
        </Formulario>
    );
};

export default Buscar;