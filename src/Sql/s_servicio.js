const query = require('../Database/consultar');
const sql = require('../Database/scripts');
const connection = require('../Database/mysql');
const config = require('../config');



const solicitar_servicio_niniera = async (servicio) =>
{
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };
    
    try 
    {
        
        respuesta = await query.consulta_sql(sql.SQL_VAL_EXISTE_SOL_SERVICIO, [servicio.id_persona]);
        if(respuesta.tipo_error == 0)
        {
            if(respuesta.resultado[0].existe == 0)
            {
                connection.beginTransaction(async (err) =>
                    {
                        if(err) throw err;

                        respuesta = await query.consulta_sql(sql.SQL_ADD_SOL_SERVICIO,
                            [
                                servicio.id_persona,
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
                        
                        if(respuesta.tipo_error != 0)
                        {
                            connection.rollback(err => console.log(err));
                            return respuesta;
                        }
                        let id_solicitud = respuesta.resultado.insertId;

                        for (let i = 0; i < servicio.cuidados.length; i++) {

                            respuesta = await query.consulta_sql(sql.SQL_VAL_EXISTE_CUIDAD, [servicio.cuidados[i], servicio.id_persona]);
                            if(respuesta.tipo_error != 0)
                            {
                                connection.rollback(err => console.log(err));
                                return respuesta;
                            }
                            if(respuesta.resultado[0].existe == 1)
                            {
                                respuesta = await query.consulta_sql(sql.SQL_ADD_DETALLE_CIUDAD_SERVICIO, [id_solicitud,servicio.cuidados[i]]);
                                if(respuesta.tipo_error != 0)
                                {
                                    connection.rollback(err => console.log(err));
                                    return respuesta;
                                }
                            }                           
                        }
                        if(respuesta.tipo_error == 0){

                            connection.commit(()=>{})
                        }
                    }
                );
                
            }
            else
            {
                respuesta.mensaje = 'Tiene una solicitud en proceso.';
                respuesta.tipo_error = 1;
            }
        }
        respuesta.resultado = null;
        if(respuesta.tipo_error == 0)
        {
            respuesta.mensaje = 'Se creo correctamente.'
        }
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

        respuesta = await query.consulta_sql(sql.SQL_GET_ONE_SERVICIOS, [servicio.id_solicitud, servicio.id_persona,1]);
        if(respuesta.tipo_error == 0)
        {
            if(respuesta.resultado.length > 0)
            {
                info_solicitud = respuesta.resultado[0];
                
                respuesta = await query.consulta_sql(sql.SQL_GET_UBI_ONE_SERVICIO,[servicio.id_solicitud, servicio.id_persona,info_solicitud.id_ubicacion,1]);
                if(respuesta.tipo_error == 0)
                    info_solicitud.ubicacion = respuesta.resultado[0];

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


module.exports = 
{
    solicitar_servicio_niniera,
    obtener_one_servicio
}


