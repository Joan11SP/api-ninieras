const config = require('../config');
const s_login_registro = require('../Sql/s_login_registro');


const registrar_persona = async (req,res,next) =>
{
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };

    try 
    {
        let { tipo_persona, nombres, apellidos, nombre_completo, sexo, correo, telefono, identificacion, fecha_nacimiento, usuario, contrasenia } = req.body;

        if(!tipo_persona || !nombres || !apellidos || !nombre_completo || !sexo || !correo || !telefono || !identificacion || !fecha_nacimiento || !usuario || !contrasenia)
        {
            respuesta.mensaje = config.MENSAJE_FALTA_INFO;
            respuesta.tipo_error = config.COD_FALTA_INFO;
        }
        else
        {
            let crear_persona = await s_login_registro.registrar_persona(req.body);
            respuesta = crear_persona;
        }

    } 
    catch (error) 
    {
        
    }
    req.body = respuesta;
    next();
}

const validar_login = async (req,res, next) =>
{
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };
    try 
    {
        let { usuario, contrasenia } = req.body
        if(!usuario || !contrasenia)
        {
            respuesta.mensaje = config.MENSAJE_FALTA_INFO;
            respuesta.tipo_error = config.COD_FALTA_INFO;
        }
        else
        {

        }
    } 
    catch (error) 
    {
        
    }
    req.body = respuesta;
    next();
}

module.exports = 
{
    validar_login,
    registrar_persona
}