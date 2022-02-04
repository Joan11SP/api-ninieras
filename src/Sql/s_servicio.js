const query = require('../Database/consultar');
const sql = require('../Database/scripts');
const connection = require('../Database/mysql');
const config = require('../config');



const solicitar_servicio_niniera = async (servicio) =>
{
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };
    
    try 
    {
        
        respuesta = await query.consulta_sql(sql.SQL_VAL_EXISTE_SOL_SERVICIO, [servicio.id_cliente]);
        if(respuesta.tipo_error == 0)
        {
            if(respuesta.resultado[0].existe == 0)
            {
                await connection.beginTransaction((err) => {console.log(err);});

                respuesta = await query.consulta_sql(sql.SQL_ADD_SOL_SERVICIO,
                    [
                        servicio.id_cliente,
                        servicio.id_ubicacion,
                        servicio.hora_inicio,
                        servicio.hora_fin,
                        servicio.fecha_inicio,
                        servicio.fecha_fin,
                        servicio.total_dias,
                        servicio.codigo_dactilar,
                        servicio.identificacion,
                        servicio.usu_wifi,
                        servicio.descripcion,
                        servicio.total_horas
                    ]                    
                );
                console.log(respuesta);
                if(respuesta.tipo_error != 0)
                {
                    await connection.rollback(() => console.log('Error'));
                    return respuesta;
                }
                let id_solicitud = respuesta.resultado.insertId;

                for (let i = 0; i < servicio.cuidados.length; i++) {

                    respuesta = await query.consulta_sql(sql.SQL_VAL_EXISTE_CUIDAD, [servicio.cuidados[i], servicio.id_cliente]);
                    if(respuesta.tipo_error != 0)
                    {
                        await connection.rollback(err => console.log(err));
                        return respuesta;
                    }
                    if(respuesta.resultado[0].existe == 1)
                    {
                        respuesta = await query.consulta_sql(sql.SQL_ADD_DETALLE_CIUDAD_SERVICIO, [id_solicitud,servicio.cuidados[i]]);
                        if(respuesta.tipo_error != 0)
                        {
                            await connection.rollback(err => console.log(err));
                            return respuesta;
                        }
                    }                           
                }
                if(respuesta.tipo_error == 0){

                    await connection.commit(()=>{})
                }
                
            }
            else
            {
                respuesta.mensaje = 'Tiene una solicitud en proceso.';
                respuesta.tipo_error = 1;
            }
        }
        respuesta.resultado = null;
        console.log(respuesta);
    } 
    catch (error) 
    {
        throw error;    
    }

    return respuesta;
}

// obtener servicio que se encuentra creado
const obtener_one_servicio = async (servicio) =>
{
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };
    let info_solicitud = {};
    try 
    {

        respuesta = await query.consulta_sql(sql.SQL_GET_ONE_SERVICIOS, [servicio.id_solicitud, servicio.id_cliente,1]);
        if(respuesta.tipo_error == 0)
        {
            if(respuesta.resultado.length > 0)
            {
                info_solicitud = respuesta.resultado[0];
                
                respuesta = await query.consulta_sql(sql.SQL_GET_UBI_ONE_SERVICIO,[servicio.id_solicitud, servicio.id_cliente,info_solicitud.id_ubicacion,1]);
                if(respuesta.tipo_error == 0)
                    info_solicitud.ubicacion = respuesta.resultado[0];

                respuesta = await query.consulta_sql(sql.SQL_GET_CUIDADO_SERVICIO, [servicio.id_solicitud]);
                if(respuesta.tipo_error == 0)
                    info_solicitud.cuidados = respuesta.resultado

                delete info_solicitud.id_ubicacion
            }
            else
            {
                respuesta.tipo_error = 1;
                respuesta.mensaje = "La solicitud no existe."
            }
        }
        if(respuesta.tipo_error == 0)
            respuesta.resultado = info_solicitud
        else
            respuesta.resultado = null;
    } 
    catch (error) 
    {
        throw error;
    }
    return respuesta;
}

const add_proponer_servicio = async (propuesta) =>
{
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };
    try
    {
        // validar si esta disponible la solicitud
        respuesta = await query.consulta_sql(sql.SQL_VAL_SOLICITUD_VIGENTE, [propuesta.id_solicitud]);
        if(respuesta.tipo_error == 0)
        {
            if(respuesta.resultado[0].existe == 0)
            {
                respuesta.mensaje = "La solicitud ya no se encuentra disponible";
                respuesta.resultado = null;
                respuesta.tipo_error = 1;
                return respuesta;
            }
        }
        else
            return respuesta;

        // validar si ya propuso el servicio
        respuesta = await query.consulta_sql(sql.SQL_VAL_EXISTE_PROPUESTA, [propuesta.id_solicitud,propuesta.id_niniera]);
        if(respuesta.tipo_error == 0)
        {
            if(respuesta.resultado[0].existe != 0)
            {
                respuesta.mensaje = "Ya realizó la propuesta del servicio";
                respuesta.resultado = null;
                respuesta.tipo_error = 1;
                return respuesta;
            }
        }
        else
            return respuesta;

        respuesta = await query.consulta_sql(sql.SQL_ADD_PROPUESTA_SERVICIO, [propuesta.id_solicitud, propuesta.id_niniera]);

        if(respuesta.tipo_error == 0)
        {
            if(respuesta.resultado.insertId > 0)
            {
                // obtener nombre propone y token para notificar al cliente
                respuesta = await query.consulta_sql(sql.SQL_GET_INFO_NOTIFI_PROPUESTA, [propuesta.id_solicitud, propuesta.id_niniera]);

                if(respuesta.tipo_error == 0)
                {
                    if(respuesta.resultado.length > 0)
                    {
                        let res = respuesta.resultado;
                        respuesta.resultado = { nombre_propone:  res[1].info, token_fcm: res[0].info }
                    }
                }

            }


        }

    }
    catch (error) 
    {
        throw error;
    }
    return respuesta;
}



module.exports = 
{
    solicitar_servicio_niniera,
    obtener_one_servicio,
    add_proponer_servicio
}


