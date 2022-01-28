const config = require('../config');
const s_login_registro = require('../Sql/s_login_registro');
const utilidades = require('../utilities/utilidades');


const registrar_persona = async (req,res,next) =>
{
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };

    try 
    {
        let { nombres, apellidos, nombre_completo, sexo, correo, telefono, identificacion, fecha_nacimiento, usuario, contrasenia } = req.body;
        let { app } = req.headers;
        if(!nombres || !apellidos || !nombre_completo || !sexo || !correo || !telefono || !identificacion || !usuario || !app)
        {
            respuesta.mensaje = config.MENSAJE_FALTA_INFO;
            respuesta.tipo_error = config.COD_FALTA_INFO;
        }
        else if (req.body.app != 'app_cliente' || req.body.app != 'app_niniera')
        {
            respuesta.mensaje = 'Proceso incorrecto';
            respuesta.tipo_error = config.COD_FALTA_INFO;
        }
        else
        {
            req.body.app = app;
            let crear_persona = await s_login_registro.registrar_persona(req.body);
            respuesta = crear_persona;
        }

    } 
    catch (error) 
    {
        respuesta = utilidades.respuesta_error(error);
    }
    req.body = respuesta;
    next();
}

const obtener_preguntas = async (req,res,next) => 
{
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };

    try 
    {
        respuesta = await s_login_registro.obtener_preguntas();
    } 
    catch (error) 
    {
        
    }
    req.body = respuesta;
    next();
}

const registrar_cuestionario = async (req,res,next) =>
{
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };
    try 
    {
        if(!req.body.id_persona || !req.body.respuestas)
        {
            respuesta.mensaje = config.MENSAJE_FALTA_INFO;
            respuesta.tipo_error = config.COD_FALTA_INFO;
        }
        else
        {
            respuesta = await s_login_registro.registrar_preguntas(req.body.id_persona, req.body.respuestas)
        }
    } 
    catch (error) 
    {
        respuesta = utilidades.respuesta_error(error);
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
        if(!usuario)
        {
            respuesta.mensaje = config.MENSAJE_FALTA_INFO;
            respuesta.tipo_error = config.COD_FALTA_INFO;
        }
        else
        {
            let campo = null;
            switch (req.body.tipo_ingreso) 
            {
                case 1:
                    if(utilidades.validar_correo(req.body.usuario))
                        campo = 'correo'
                    else if(!isNaN(req.body.usuario))
                        campo = 'telefono'            
                    else
                        campo = 'usuario'
                    break;
                case 2:
                    campo = 'token_facebook'
                    break;
                case 3:
                    campo = 'token_google'
                    break;
                default:
                    break;
            }
            respuesta = await s_login_registro.validar_login(req.body, campo);
        }
    } 
    catch (error) 
    {
        respuesta = utilidades.respuesta_error(error);   
    }
    req.body = respuesta;
    next();
}

const validar_login_admin = async (req,res, next) =>
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
            respuesta = await s_login_registro.validar_login_admin(req.body);
        }
    } 
    catch (error) 
    {
        respuesta = utilidades.respuesta_error(error);   
    }
    req.body = respuesta;
    next();
}

const registrar_horario = async (req,res,next) =>
{

    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };
    try 
    {
        let { id_persona, disponible } = req.body
        
        req.body = respuesta;

        if(!id_persona || !disponible)
        {
            respuesta.mensaje = config.MENSAJE_FALTA_INFO;
            respuesta.tipo_error = config.COD_FALTA_INFO;
            next();
        }
        if(disponible.length > 7)
        {
            respuesta.mensaje = "No se puede registrar más de 7 días";
            respuesta.tipo_error = 1;
            next();
        }
        
        if(disponible.length == 0)
        {
            respuesta.mensaje = "No existen días para registrar";
            respuesta.tipo_error = 1;
            next();
        }

        disponible.forEach(hora => {
            
            if(hora.dia > 7 || hora.dia < 1)
            {
                respuesta.mensaje = "Días fuera de rango";
                respuesta.tipo_error = 1;
                next();
            }
        });
        let horario = { id_persona, disponible }
        respuesta = await s_login_registro.registrar_horario(horario);
        
    } 
    catch (error) 
    {
        respuesta = utilidades.respuesta_error(error); 
    }
    req.body = respuesta;
    next();

}

module.exports = 
{
    validar_login,
    registrar_persona,
    obtener_preguntas,
    registrar_cuestionario,
    validar_login_admin,
    registrar_horario
}