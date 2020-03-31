export default function validarCrearCuenta(valores){
    let errores={};

    //validar nombre
    if(!valores.nombre){
        errores.nombre = "el nombre es obligatorio";
    } 
    //validar email
    if(!valores.email){
        errores.email = "el email es obligatorio"
    } else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)){
        errores.email="email no valido";
    }
    //validar passwords
    if(!valores.password){
        errores.password = "el password es obligatorio"
    } else if(valores.password.length < 6){
        errores.password="el password debe tener al menos 6 caracteres"
    }

    return errores
}