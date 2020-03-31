export default function validarCrearProducto(valores){
    let errores={};

    //validar nombre
    if(!valores.nombre){
        errores.nombre = "el nombre es obligatorio";
    } 
    //validar empresa

    if(!valores.empresa){
        errores.empresa="nombre de empresa es obligatorio"
    }
    //validar url
    if(!valores.url){
        errores.url = "la URL del producto es obligatoria"
    }else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url="URL mal formateada o no valida"
    }


    //validar descripcion
    if(!valores.descripcion){
        errores.descripcion="agrega una descripcion de tu producto";
    }

    return errores
}