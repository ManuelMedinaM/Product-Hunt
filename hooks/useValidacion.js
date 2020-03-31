import React,{useState, useEffect} from 'react';


const useValidacion = (stateInicial, validar, fn) => {

    const[valores, setValores] = useState(stateInicial);
    const[errores, setErrores] = useState({})
    const[subMitForm, setsubMitForm] = useState(false)

    useEffect(()=>{
        if(subMitForm){
            const noErrores = Object.keys(errores).length === 0 ;
            if(noErrores){
                fn(); //FN =  funcion que se ejecuta en el componente
            }
        }
        setsubMitForm(false);

        
    },[errores])
    //funcion que se ejecuta conforme el usuario escribe algo
    const handleChange = e =>{
        setValores({
            ...valores,
            [e.target.name] : e.target.value
        })
    }

    // funcion que se ejecuta cuand el usuario hace submir

    const handleSubmit = e =>{
        e.preventDefault();
        //esta funcion se comunica con la funcion de alidar del otro lado
        const erroresValidacion = validar(valores)
        setErrores(erroresValidacion);
        setsubMitForm(true);
    }


    //mostrar error cuando el usuario esta escribiendo y se sale 
    const handleBlur = ()=>{
        const erroresValidacion = validar(valores)
        setErrores(erroresValidacion);
    }


    return {
        valores,
        errores,
        handleSubmit,
        handleChange,
        handleBlur
    };
};

export default useValidacion;