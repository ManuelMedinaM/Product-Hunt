import React, {useEffect,useContext,useState} from 'react';
import {useRouter} from 'next/router'

import {FirebaseContext} from '../../firebase'
import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/Layout';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {es} from 'date-fns/locale';
import {Campo, InputSubmit} from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

const Titulo = styled.h1`
    text-align:center;
    margin-top:5rem;
`;
const ContenedorProducto = styled.div`
    @media (min-width:768px){
        display:grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }

`
const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color:#fff;
    text-transform:uppercase;
    font-weight:bold;
    display:inline-block;
    text-align:center;
`

const Producto = () => {
    const [producto, setProducto] = useState({});
    const [error, setError] = useState(false);
    const [comentario, setComentario] = useState({});
    const [consultarDB, setConsultarDB] = useState(true);


    //Routing para obtener el id actual
    const router = useRouter();
    const {query:{id}} = router;

    const {firebase, usuario} = useContext(FirebaseContext);

    useEffect(()=>{
        if(id && consultarDB){
            const obtenerProducto = async ()=>{
                const query = await firebase.db.collection('productos').doc(id);
                const producto = await query.get()
                if(producto.exists){
                    setProducto(producto.data());
                    setConsultarDB(false);
                }else{
                    setError(true);
                    setConsultarDB(false);

                }
            }
            obtenerProducto();
        }
    },[id,consultarDB]);

    if(Object.keys(producto).length === 0 && !error) return 'Cargando...';
    //mientras se llena

    const {comentarios, creado, descripcion, empresa, nombre, url, urlImg,votos, creador, haVotado} = producto;

    //administrar y validar los votos

    const votarProducto = async()=>{
        if(!usuario){
            return router.push('/login');
        }

        //obtener y sumar un nuevo voto
        const nuevoTotal = votos+1;

        //verificar si el usuario actual a votado
        if(haVotado.includes(usuario.uid)) return;

        //guardar el ide del usuario que ha votado
        const nuevoHaVotado = [...haVotado, usuario.uid];

        //actualizar en la base de datos
        await firebase.db.collection('productos').doc(id).update({
            votos:nuevoTotal, 
            haVotado:nuevoHaVotado
        });

        //actualizar state
        setProducto({
            ...producto,
            votos: nuevoTotal
        })

        setConsultarDB(true); //hay un voto, por ende consultamos
    }

    //Funciones para crear el comentario
    const comentarioChange = e =>{
        setComentario({
            ...comentario,
            [e.target.name] :  e.target.value
        })
    }

    //identifica si el comentario es del creador del producto
    const esCreador = id =>{
        if(creador.id == id){
            return true;
        }
    }


    const agregarComentario = async e =>{
        e.preventDefault();

        if(!usuario){
            return router.push('/login');
        }

        // Infrmacion extra
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre=usuario.displayName;

        //Tomar copia de comentarios y agregaarlo al arreglo
        const nuevosComentarios = [...comentarios, comentario];

        //acualizar base de datos

        await firebase.db.collection('productos').doc(id).update({comentarios:nuevosComentarios});
        //acutalizar state
        setProducto({
            ...producto,
            comentarios: nuevosComentarios
        })

        setConsultarDB(true); //hay un comentaerio, por ende consultamos

    }   

    //funcion que revisa que el creador del producto este autenticado

    const puedeBorrar = () =>{
        if(!usuario) return false;

        if(creador.id === usuario.uid){
            return true;
        }

    }

    //eliminar producto 

    const eliminarProducto = async()=>{
        if(!usuario){
            return router.push('/login');
        }
        if(creador.id !== usuario.uid){
            return router.push('/login');
        }
        try {
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }
    


    return (
        <Layout>
            <>
                { error? <Error404/>:(
                    <div className="contenedor">
                    <Titulo>
                        {nombre}
                    </Titulo>
                    <ContenedorProducto>
                        <div>
                            <p>Publicado hace: {formatDistanceToNow( new Date(creado), {locale: es})}</p>
                            <p>Por: {creador.nombre} de {empresa}</p>
                            <img src={urlImg}/>
                            <p>{descripcion}</p>

                            {usuario && (
                                <>
                                <h2>Agrega tu comentario</h2>
                                <form
                                    onSubmit={agregarComentario}
                                >
                                    <Campo>
                                        <input
                                            type="text"
                                            name="mensaje"
                                            onChange={comentarioChange}
                                        />
                                    </Campo>
                                    <InputSubmit
                                        type="submit"
                                        value="Agregar comentario"
                                    />
                                </form>
                                </>
                            )}

                            <h2>Comentarios</h2>
                            {comentarios.length===0? "Aún no hay comentarios" : <p>{comentarios.length} comentarios</p>}
                            <ul>
                                {comentarios.map((comentario,i)=>(
                                    <li
                                        key={`${comentario.usuarioId}-${i}`}
                                        style={{"border":"1px solid #e1e1e1", "padding":"1rem"}}
                                    >
                                        <p>{comentario.mensaje}</p>

                                        <p>Escrito Por:  
                                            <span
                                                style={{"fontWeight":"bold"}}
                                            >
                                             {' '}   {comentario.usuarioNombre}
                                            </span>
                                        </p>
                                        {esCreador(comentario.usuarioId) && <CreadorProducto>Es el creador</CreadorProducto>}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <aside
                        >
                            <Boton
                                target="_blank"
                                bgColor="true"
                                href={url}
                                >Visitar URL
                            </Boton>
                           
                            <div style={{"marginTop":"5rem"}}>
                                <p
                                    style={{"textAlign":"center"}}
                                >{votos} Votos</p>

                              {usuario &&(
                                <Boton
                                    onClick={votarProducto}
                                >
                                    Votar
                                </Boton>)}
                            </div>
                        </aside>
                    </ContenedorProducto>
                    {puedeBorrar() && <Boton
                            onClick={eliminarProducto}
                    >Eliminar Producto</Boton>}
                </div>
                )}
            </>
        </Layout>
    );
};

export default Producto;