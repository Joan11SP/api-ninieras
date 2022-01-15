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


module.exports = 
{
    actualizar_foto_perfil,
    obtener_foto_perfil
}