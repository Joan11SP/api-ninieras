const moment = require('moment');
const config = require('../config');
const s_servicio = require('../Sql/s_servicio');
const utilidades = require('../utilities/utilidades');

const solicitar_servicio_niniera = async (req,res,next) =>
{
    let respuesta = { mensaje: '', tipo_error: 1, resultado: null };
    try 
    {
        if(!req.body.id_ubicacion || 
            !req.body.fecha_inicio || 
            !req.body.fecha_fin || 
            !req.body.hora_inicio || 
            !req.body.hora_fin || 
            !req.body.codigo_dactilar ||
            !req.body.identificacion ||
            !req.body.id_persona ||
            !req.body.cuidados
         )
        {
            respuesta.mensaje = config.MENSAJE_FALTA_INFO;
            respuesta.tipo_error = config.COD_FALTA_INFO;
        }                    
        else if(req.body.fecha_fin < req.body.fecha_inicio)
        {
            respuesta.mensaje = 'La fecha fin no puede ser menor a la fecha inicio.';
            //next();
        }
        else if(req.body.fecha_inicio < moment().format('YYYY-MM-DD'))
        {
            respuesta.mensaje = 'La fecha inicio no puede ser menor a la fecha actual';
            //next();
        }
        else if(req.body.cuidados.length < 1)
        {
            respuesta.mensaje = 'Agregar personas o animales a cuidar.';
            //next();
        }
        else
        {
            let fecha_inicio = moment(req.body.fecha_inicio);
            let fecha_fin = moment(req.body.fecha_fin)
            req.body.total_dias = fecha_fin.diff(fecha_inicio, 'days');

            var entryHour = moment(req.body.hora_inicio, 'hh:mm A');
            var exitHour = moment(req.body.hora_fin, 'hh:mm A');

            req.body.total_horas = moment.duration(exitHour.diff(entryHour)).asHours();

            respuesta = await s_servicio.solicitar_servicio_niniera(req.body);
            req.body = null;
        }
    } 
    catch (error) 
    {
        respuesta = utilidades.respuesta_error(error);
    }
    req.body = respuesta;
    next();
}

const obtener_one_servicio = async (req,res,next) =>
{
    let respuesta = { mensaje: '', tipo_error: 1, resultado: null };

    try 
    {
        if(!req.body.id_persona || !req.body.id_solicitud)
        {
            respuesta.mensaje = config.MENSAJE_FALTA_INFO;
            respuesta.tipo_error = config.COD_FALTA_INFO;
        }
        else
        {
            respuesta = await s_servicio.obtener_one_servicio(req.body);
        }
        
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
    solicitar_servicio_niniera,
    obtener_one_servicio
}

