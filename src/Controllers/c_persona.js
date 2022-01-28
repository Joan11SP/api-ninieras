const config = require('../config');
const s_persona = require('../Sql/s_persona');
const utilidades = require('../utilities/utilidades');
const fs = require('fs');

const cambiar_foto_perfil = async (req,res,next) =>
{
    var respuesta = { mensaje: 'Se subió correctamente la imagen', tipo_error:0, resultado: null };

    try 
    {
        let id_persona = JSON.parse(JSON.stringify(req.body.id_persona))
        if(!id_persona || !req.file)
        {
            respuesta.mensaje = config.MENSAJE_FALTA_INFO;
            respuesta.tipo_error = config.COD_FALTA_INFO;
            next();
        }
        fs.rename(req.file.path, config.UBICACION_IMAGEN_PERFIL+req.file.filename,(err) =>
            { if (err) throw err; }
        );
        
        let foto = { id_persona: id_persona, url: req.file.filename }
        
        respuesta = await s_persona.actualizar_foto_perfil(foto);

        if(respuesta.tipo_error != 0)
        {
            fs.unlink(config.UBICACION_IMAGEN_PERFIL+req.file.filename, (err)=>{console.log(err);});
        }
    } 
    catch (error) 
    {
        respuesta = utilidades.respuesta_error(error);
    }
    req.body = respuesta;
    next();

}

const obtener_foto_perfil = async (req,res,next) =>
{
    var respuesta = { mensaje: '', tipo_error:0, resultado: null };
    try 
    {
        if(!req.body.id_persona)
        {
            respuesta.mensaje = config.MENSAJE_FALTA_INFO;
            respuesta.tipo_error = config.COD_FALTA_INFO;
        }
        else
        {
            respuesta = await s_persona.obtener_foto_perfil({id_persona:req.body.id_persona});

            if(respuesta.tipo_error == 0)
            {
                respuesta.resultado = req.protocol + '://' + req.headers.host + '/imagenes_app/' + respuesta.resultado[0].foto
            }

        }

    } 
    catch (error) 
    {
        respuesta = utilidades.respuesta_error(error);
    }
    req.body = respuesta;
    next();
}

const add_persona_o_animal_cuidado = async (req,res, next) =>
{
    var respuesta = { mensaje: '', tipo_error: 1, resultado: null };
    try 
    {
        if (!req.body.id_cliente
            || !req.body.nombres
            || !req.body.edad
            || !req.body.sexo
            || (req.body.capacidad_diferente == '' && req.body.capacidad_diferente == null)
            || !req.body.es_persona_o_animal
        )
        {
            respuesta.mensaje = config.MENSAJE_FALTA_INFO;
            respuesta.tipo_error = config.COD_FALTA_INFO;
        }
        else if(req.body.sexo != 'M' && req.body.sexo != 'F')
            respuesta.mensaje = 'Sexo incorrecto.'
        else if (req.body.edad > 120 || req.body.edad < 1)
            respuesta.mensaje = 'Edad incorrecta.'
        else if (req.body.es_persona_o_animal != 1 && req.body.es_persona_o_animal != 2)
            respuesta.mensaje = 'Tipo registro incorrecto.'
        else
        {
            respuesta = await s_persona.add_persona_o_animal_cuidado(req.body);
        }
    } 
    catch (error) 
    {
        respuesta = utilidades.respuesta_error(error);
    }
    req.body = respuesta;
    next();
}

const add_ubicacion = async (req,res,next) =>
{
    var respuesta = { mensaje: '', tipo_error: 1, resultado: null };
    try 
    {
        if (!req.body.id_cliente
            || !req.body.nombre_ubicacion
            || !req.body.latitud
            || !req.body.longitud
            || !req.body.referencia
            || !req.body.calles
        )
        {
            respuesta.mensaje = config.MENSAJE_FALTA_INFO;
            respuesta.tipo_error = config.COD_FALTA_INFO;
        }
        else
            respuesta = await s_persona.add_ubicacion(req.body);
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
    cambiar_foto_perfil,
    obtener_foto_perfil,
    add_persona_o_animal_cuidado,
    add_ubicacion
}


