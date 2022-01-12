const conexion = require('./mysql');

const util = require('util');
const mysql = util.promisify(conexion.query).bind(conexion);

const consulta_sql = async (sql, variables) => 
{
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };
    let consulta = null;
    try 
    {
        if (variables)
            consulta = await mysql(sql, variables);
        else
            consulta = await mysql(sql);

        let result = JSON.stringify(consulta)
        respuesta.resultado = JSON.parse(result);
    } 
    catch (error) 
    {
        respuesta.mensaje = error;
        respuesta.tipo_error = 3;
        respuesta.resultado = null;
        console.log(error);
    }

    return respuesta;
}

module.exports = 
{ 
    consulta_sql
}