let regex_correo = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const validar_correo = (correo) =>
{
    let validado = false;

    if(regex_correo.test(correo))
        validado = true;
    console.log(validado);
    return validado;
}

const respuesta_error = (error) =>
{
    let respuesta = 
    { 
        mensaje: 'Ocurrió un error vuelve a intentarlo', 
        tipo_error: 1,
        resultado: null 
    };
    console.log(error);
    // guardar error que se produjo

    return respuesta;

}

module.exports = 
{
    validar_correo,
    respuesta_error
}