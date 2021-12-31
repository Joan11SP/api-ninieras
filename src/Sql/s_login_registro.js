const query = require('../Database/consultar');
const sql = require('../Database/scripts');
const connection = require('../Database/mysql')


const registrar_persona = async (persona) => {
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };
    try {

        let existe_persona = await query.consulta_sql(sql.SQL_EXISTE_PERSONA, [persona.correo, persona.telefono, persona.identificacion]);
        if (existe_persona.tipo_error == 0) {
            if (existe_persona.resultado[0]) {
                respuesta.tipo_error = 3;
                respuesta.mensaje = "El correo, telefono o identificación ya existe";
                return respuesta;
            }
            let existe_login = await query.consulta_sql(sql.SQL_EXISTE_LOGIN_CLIENTE, [persona.usuario]);
            if (existe_login.tipo_error == 0) {
                if (existe_login.resultado[0]) {
                    respuesta.tipo_error = 3;
                    respuesta.mensaje = "El usuario ya existe";
                    return respuesta;
                }
            }
            else {
                respuesta = existe_login;
                return respuesta;
            }
        }
        else {
            respuesta = existe_persona;
            return respuesta;
        }
        connection.beginTransaction(async err => 
        {
            if (err) throw err;

            let crear_persona = await query.consulta_sql(sql.SQL_REGISTRAR_PERSONA,
                [
                    persona.tipo_persona,
                    persona.nombres,
                    persona.apellidos,
                    persona.nombre_completo,
                    persona.sexo,
                    persona.correo,
                    persona.telefono,
                    persona.identificacion,
                    persona.fecha_nacimiento
                ]
            );
            if (crear_persona.tipo_error == 0) {
                let id_persona = crear_persona.resultado.insertId;

                let crear_login = await query.consulta_sql(sql.SQL_REGISTRAR_LOGIN_CLIENTE,
                    [
                        id_persona,
                        persona.usuario,
                        persona.contrasenia,
                        persona.token_fb,
                        persona.token_google,
                        persona.imei,
                        persona.huella_habilitado,
                        persona.token_fcm,
                        0,
                        1,
                        0
                    ]
                );
                if (crear_login.tipo_error == 0) 
                {
                    let id_login = crear_login.resultado.insertId;
                    connection.commit( () => console.log('successfuly') )
                }
                else
                {
                    connection.rollback(() => console.log('error') );
                    respuesta = crear_login;
                }
            }
            else
            {
                connection.rollback(() => console.log('error') );
                respuesta = crear_persona;
            }
        });

    }
    catch (error) {
        throw error;
    }
    return respuesta;

}

module.exports =
{
    registrar_persona
}
