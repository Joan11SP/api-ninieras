const query = require('../Database/consultar');
const sql = require('../Database/scripts');
const connection = require('../Database/mysql');
const config = require('../config');

const actualizar_foto_perfil = async (foto) =>
{
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };

    try 
    {
        respuesta = await query.consulta_sql(sql.SQL_UPD_FOTO_PERFIL, [ foto.url, foto.id_persona]);

        if(respuesta.tipo_error == 0)
        {
            if(respuesta.resultado.affectedRows == 0)
            {
                respuesta.tipo_error = 1;
                respuesta.mensaje = 'No se actualizó ningun archivo'
            }
        }
        respuesta.resultado = null;
    } 
    catch (error) 
    {
        throw error;
    }
    return respuesta;

}

const obtener_foto_perfil = async (foto) =>
{
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };

    try 
    {
        respuesta = await query.consulta_sql(sql.SQL_GET_FOTO_PERFIL, [ foto.id_persona]);

        if(respuesta.tipo_error == 0)
        {
            if(!respuesta.resultado[0])
            {
                respuesta.tipo_error = 1;
                respuesta.mensaje = 'Sin resultados.'
                respuesta.resultado = null;
            }
        }
    } 
    catch (error) 
    {
        throw error;
    }
    return respuesta;

}

const add_persona_o_animal_cuidado = async (cuidado) =>
{
    let respuesta = { mensaje: 'Se agregó correctamente.', tipo_error: 0, resultado: null };

    try 
    {
        respuesta = await  query.consulta_sql(sql.SQL_EXISTE_LOGIN_CLIENTE, [cuidado.id_persona]);
        if(respuesta.tipo_error == 0)
        {
            if(respuesta.resultado[0].existe == 1)
            {

                respuesta = await query.consulta_sql(sql.SQL_ADD_PERS_ANIMAL_CUIDADO,
                    [
                        cuidado.id_persona,
                        cuidado.nombres,
                        cuidado.edad,
                        cuidado.sexo,
                        cuidado.capacidad_diferente,
                        cuidado.info_adicional,
                        cuidado.es_persona_o_animal
                    ]
                );

            }
            else
            {
                respuesta.mensaje = 'No existe la persona.'
                respuesta.tipo_error = 1
            }
        }
        respuesta.resultado = null;
    } 
    catch (error) 
    {
        throw error;
    }
    return respuesta;
}

const add_ubicacion = async (ubicacion) =>
{
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };
    try
    {
        respuesta = await  query.consulta_sql(sql.SQL_EXISTE_LOGIN_CLIENTE, [ubicacion.id_persona]);
        if(respuesta.tipo_error == 0)
        {
            if(respuesta.resultado[0].existe == 1)
            {

                respuesta = await query.consulta_sql(sql.SQL_ADD_UBICACION,
                    [
                        ubicacion.nombre_ubicacion.toString().trim(),
                        ubicacion.latitud,
                        ubicacion.longitud,
                        ubicacion.referencia.toString().trim(),
                        ubicacion.calles.toString().trim(),
                        ubicacion.id_persona
                    ]
                );
            }
            else
            {
                respuesta.mensaje = 'No existe la persona.'
                respuesta.tipo_error = 1
            }
        }
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
    actualizar_foto_perfil,
    obtener_foto_perfil,
    add_persona_o_animal_cuidado,
    add_ubicacion
}