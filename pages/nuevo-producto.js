import React, { useState, useContext } from 'react'
import Layout from '../components/layout/Layout'
import {Formulario, Campo, InputSubmit,Error} from '../components/ui/Formulario'
import {Titulo} from '../components/ui/CentradoText';
import Router, {useRouter} from 'next/router';

import {FirebaseContext} from '../firebase'
import FileUploader from 'react-firebase-file-uploader';

//validaciones
import useValidacion from '../hooks/useValidacion'
import validarCrearProducto from '../validacion/ValidarCrearProducto'
import Error404 from '../components/layout/404';

const STATE_INICIAL = {
    nombre:'',
    empresa:'',
    // imagen:'',
    url:'',
    descripcion:'',
}
const NuevoProducto = () => {

  //satae de las imagenes
  const [nombreImagen, setNombreImagen] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [urlImg, setUrlImg] = useState('');

  const[error,setError]=useState(false);

  // colocar cuerpo
  const { valores,errores,handleSubmit,handleChange,handleBlur}=useValidacion( STATE_INICIAL, validarCrearProducto,crearProducto)

  const {nombre, empresa, imagen,url,descripcion} = valores;

  // hook de routing para direccionar
  const router = useRouter();

  //context con las operaciones crud de firebase
  const {usuario, firebase} = useContext(FirebaseContext);

  async function crearProducto(){

    //si el usuario no esta autenticado llevar al login
    if(!usuario){
      return  router.push('/login')
    }
      const producto={
        nombre, empresa, url, urlImg , descripcion, votos:0, comentarios: [], 
        creado: Date.now(),creador:{
          id: usuario.uid,
          nombre: usuario.displayName
        },
        haVotado:[]
      }

      //insertar en la base de datos
      firebase.db.collection('productos').add(producto);
      return Router.push("/")

  }




  //OPERACIONESD DE IMAGEN

  const handleUploadStart = ()=>{
    setProgreso(0);
    setSubiendo(true);
  }
  const handleProgress = progreso => setProgreso({progreso});
  const handleUploadError = error =>{
    setSubiendo(error);
    console.error(error);
  }
  const handleUploadSuccess = nombre=>{
    setProgreso(100);
    setSubiendo(false);
    setNombreImagen(nombre);
    firebase
      .storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL()
      .then(url=>{
        setUrlImg(url)
        });
  }

  return(
      <div>
      <Layout>
        {!usuario?  <Error404/> : (<>
              <Titulo>Nuevo Producto</Titulo>
              <Formulario
                  onSubmit={handleSubmit}
                  noValidate
              >
                <fieldset>
                  <legend>
                    Informacion General
                  </legend>
                  <Campo>
                      <label htmlFor="nombre">Nombre</label>
                      <input
                          type="text"
                          id="nombre"
                          placeholder="Nombre de Producto"
                          name="nombre"
                          value={nombre}
                          onChange={handleChange}
                          onBlur={handleBlur}
                      />
                  </Campo>
                  {errores.nombre && <Error>{errores.nombre}</Error>}
                  <Campo>
                      <label htmlFor="empresa">empresa</label>
                      <input
                          type="text"
                          id="empresa"
                          placeholder="Tu empresa o compañia"
                          name="empresa"
                          value={empresa}
                          onChange={handleChange}
                          onBlur={handleBlur}
                      />
                  </Campo>
                  {errores.empresa && <Error>{errores.empresa}</Error>}
                  <Campo>
                      <label htmlFor="imagen">Imagen</label>
                      <FileUploader
                        accept="image/*"
                        id="imagen"
                        name="imagen"
                        randomizeFilename
                        storageRef={firebase.storage.ref("productos")}
                        onUploadStart={handleUploadStart}
                        onUploadError={handleUploadError}
                        onUploadSuccess={handleUploadSuccess}
                        onProgress={handleProgress}
                      />
                  </Campo>

                  <Campo>
                      <label htmlFor="url">url</label>
                      <input
                          type="url"
                          id="url"
                          name="url"
                          placeholder="url de tu producto"
                          value={url}
                          onChange={handleChange}
                          onBlur={handleBlur}
                      />
                  </Campo>
                  {errores.url && <Error>{errores.url}</Error>}
                </fieldset>

                <fieldset>
                  <legend>
                    Sobre tu Producto
                  </legend>
                  <Campo>
                      <label htmlFor="descripcion">Descripcion</label>
                      <textarea
                          id="descripcion"
                          name="descripcion"
                          value={descripcion}
                          onChange={handleChange}
                          onBlur={handleBlur}
                      />
                  </Campo>
                  {errores.descripcion && <Error>{errores.descripcion}</Error>}
                </fieldset>
                  {error && <Error>{error}</Error>}
                      <InputSubmit type="submit"
                          value="crear producto"
                      />
              </Formulario>
          </>)}
          
      </Layout>
    </div>
  )
}
export default NuevoProducto;
