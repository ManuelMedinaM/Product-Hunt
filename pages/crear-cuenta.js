import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import {Formulario, Campo, InputSubmit,Error} from '../components/ui/Formulario'
import {Titulo} from '../components/ui/CentradoText';
import Router from 'next/router';

import firebase from '../firebase'

//validaciones
import useValidacion from '../hooks/useValidacion'
import validarCrearCuenta from '../validacion/ValidarCrearCuenta'

const STATE_INICIAL = {
    nombre:'',
    email:'',
    password:''
}

const crearCuenta = () => {

    const[error,setError]=useState(false);

// colocar cuerpo
    const { valores,errores,handleSubmit,handleChange,handleBlur}=useValidacion( STATE_INICIAL, validarCrearCuenta,crearCuenta)

    const {nombre, email, password} = valores;


    async function crearCuenta(){
        try {
            await firebase.registrar(nombre, email, password);  
            Router.push("/");
        } catch (error) {
            console.error('hubo un error al crear el usuario ', error.message);
            setError(error.message);
        }
    }

    return(
        <div>
        <Layout>
            <>
                <Titulo>Crear cuuenta</Titulo>
                <Formulario
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Campo>
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            placeholder="Tu Nombre"
                            name="nombre"
                            value={nombre}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.nombre && <Error>{errores.nombre}</Error>}
                    <Campo>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Tu email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.email && <Error>{errores.email}</Error>}
                    <Campo>
                         <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Tu password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.password && <Error>{errores.password}</Error>}

                    {error && <Error>{error}</Error>}
                        <InputSubmit type="submit"
                            value="crear cuenta"
                        />
                </Formulario>
            </>
        </Layout>
      </div>
    )
}

export default crearCuenta;
