import React,{useState,useContext,useEffect} from "react";
import {FirebaseContext} from '../firebase'



const useProductos = orden =>{
    const [productos, setProductos] = useState([]);

    const {firebase} = useContext(FirebaseContext);

    useEffect(()=>{
        const obtenerProductos = ()=>{
        firebase.db.collection('productos').orderBy(orden, 'desc').onSnapshot(manejadorSnapshot);
        }
        obtenerProductos();
    },[]);

    function manejadorSnapshot(snapshot){
    const productos = snapshot.docs.map(doc=>{
        return{
        id: doc.id,
        ...doc.data()
        }
    });
    setProductos(productos);
    };


    return {
        productos
    }
}

export default useProductos;