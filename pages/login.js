import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import {Formulario, Campo, InputSubmit,Error} from '../components/ui/Formulario'
import {Titulo} from '../components/ui/CentradoText';
import Router from 'next/router';

import firebase from '../firebase'

//validaciones
import useValidacion from '../hooks/useValidacion'
import validarIniciarSesion from '../validacion/ValidarIniciarSesion'


const STATE_INICIAL = {
  email:'',
  password:''
}

const Login = () => {

  const[error,setError]=useState(false);

// colocar cuerpo
  const { valores,errores,handleSubmit,handleChange,handleBlur}=useValidacion( STATE_INICIAL, validarIniciarSesion,iniciarSesion)

  const { email, password} = valores;

  async function iniciarSesion(){
    try {
      await firebase.login(email,password);
      Router.push("/");
    } catch (error) {
      console.error('hubo un error al autenticar el usuario ', error.message);
      setError(error.message);
    }
  }

  return(
      <div>
      <Layout>
          <>
              <Titulo>Iniciar Sesión </Titulo>
              <Formulario
                  onSubmit={handleSubmit}
                  noValidate
              >
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
                          value="Iniciar Sesión"
                      />
              </Formulario>
          </>
      </Layout>
    </div>
  )
}

export default Login;
