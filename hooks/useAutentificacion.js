import React, {useState, useEffect} from 'react';
import firebase from '../firebase';


function useAutentificacion() {
    const[usuarioAutenticado, setUsuarioAutenticado] = useState(null);

    useEffect(()=>{
        const unsuscribe = firebase.auth.onAuthStateChanged(user=>{
            if(user){
                setUsuarioAutenticado(user);
            }else{
                setUsuarioAutenticado(null);
            }
        });
        return () => unsuscribe(); 
    },[])
    

    return usuarioAutenticado;
}

export default useAutentificacion;