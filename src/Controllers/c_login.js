const { consulta_sql } = require('../Database/consultar');

const validar_login = async (req,res, next) =>
{
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };
    try 
    {
        let { usuario, contrasenia } = req.body
        if(!usuario || !contrasenia)
        {
            respuesta.mensaje = 'Falta información';
            respuesta.tipo_error = 1;
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
    validar_login
}