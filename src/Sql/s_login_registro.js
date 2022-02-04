const query = require('../Database/consultar');
const sql = require('../Database/scripts');
const connection = require('../Database/mysql');
const utilidades = require('../utilities/utilidades');
const config = require('../config');


const registrar_persona = async (persona) => {
    // app_cliente - app_niniera tipos apps de registro

    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };
    let existe_persona = false, id_persona = 0;

    
    try {

        let existe_persona = await query.consulta_sql(sql.SQL_EXISTE_PERSONA, [persona.correo, persona.telefono, persona.identificacion]);
        if (existe_persona.resultado[0]) 
        {
            id_persona = existe_persona.resultado[0].id_persona;
            existe_persona = true;
        }
        else
            existe_persona = false
        let consulta = '';
        if(persona.app === 'app_cliente')
            consulta = sql.SQL_EXISTE_PER_CLIENTE
        else
            consulta = sql.SQL_EXISTE_PER_NINIERA

        let existe_login = await query.consulta_sql(consulta, [id_persona]);
        if (existe_login.resultado[0].existe == 1) 
        {
            respuesta.tipo_error = 3;
            respuesta.mensaje = "El usuario ya existe";
            return respuesta;
        }
        let crear_persona = null;
        await connection.beginTransaction(async err => {});

        if (existe_persona == false)
            {
                crear_persona = await query.consulta_sql(sql.SQL_REGISTRAR_PERSONA,
                    [
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
                id_persona = crear_persona.resultado.insertId;
            }
            if (id_persona != 0) 
            {

                if(persona.app === 'app_cliente')
                    consulta = sql.SQL_REGISTRAR_LOGIN_CLI_NI.replace('[tabla]','login_cliente')
                else
                    consulta = sql.SQL_REGISTRAR_LOGIN_CLI_NI.replace('[tabla]','login_niniera')

                let crear_login = await query.consulta_sql(consulta,
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
                        1
                    ]
                );
                if (crear_login.tipo_error == 0) {
                    let id_login = crear_login.resultado.insertId;
                    connection.commit(() => console.log('successful'))
                }
                else 
                {
                    connection.rollback(() => console.log('error 1'));
                    respuesta = crear_login;
                }
            }
            else 
            {
                connection.rollback(() => console.log('error 2'));
                respuesta = crear_persona;
            }

    }
    catch (error) {
        throw error;
    }
    return respuesta;

}

// obtener preguntas para el cuestionario
const obtener_preguntas = async () => {
    let preguntas;
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };
    try {
        respuesta = await query.consulta_sql(sql.SQL_PREGUNTAS);
        if (respuesta.resultado.length > 0) {
            preguntas = respuesta.resultado;
            let opciones = await query.consulta_sql(sql.SQL_OPCIONES);

            for (let i = 0; i < preguntas.length; i++) {
                let i_pregunta = preguntas[i].id_pregunta;
                let opcion = opciones.resultado.filter(id => id.id_pregunta == i_pregunta);
                if (opcion != null)
                    preguntas[i].opcion = opcion;
            }
            respuesta.resultado = preguntas;
        }
    }
    catch (error) {
        throw error;
    }
    return respuesta;

}

// registrar respuestas del cuestionario
const registrar_preguntas = async (id_persona, cuestionario) => {
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };
    try {
        let existe = await query.consulta_sql(sql.SQL_EXISTE_RESPUESTAS, [id_persona]);

        if (existe.resultado) {
            respuesta.mensaje = 'Ya realizó el cuestionario.'
            respuesta.tipo_error = 3;
            return respuesta;
        }

        let index = 1;
        await connection.beginTransaction(async err => {});
        for (let i = 0; i < cuestionario.length; i++) {
            let ins_respuestas = await query.consulta_sql(sql.SQL_INSTAR_RESPUESTAS,
                [
                    cuestionario[i].id_pregunta,
                    cuestionario[i].respuesta.toString(),
                    id_persona
                ]
            );
            if (ins_respuestas.tipo_error != 0) {
                connection.rollback(() => console.log('error'));
                respuesta = ins_respuestas;
                return respuesta;
            }
            if (index >= cuestionario.length)
                connection.commit(() => console.log('successful'))
            index++;
        }
    }
    catch (error) {
        throw error;
    }
    return respuesta;
}


// validar login de cliente o niñera

const validar_login = async (login, campo) => {
    let num_max_intentos = 3;
    //login 1 : EXITOSO\n2 : BLOQUEADO POR SUPERAR EL NUMERO DE INTENTO PERMITIDOS
    //logs 1 : EXITOSO\n2 : USUARIO INCORRECTO\n3 : CONTRASENIA INCORRECTA\n4 : BLOQUEADO POR SUPERAR EL NUMERO DE INTENTO PERMITIDOS
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };
    let tipo_login = 1;
    try {
        // 1: ingreso normal 2: token_fb 3: token_google
        let ing_normal = null, consulta = null;
        switch (campo) {
            case 'correo':
            case 'usuario':
            case 'telefono':
            case 'token_facebook':
            case 'token_google':
                consulta = sql.SQL_VALIDAR_LOGIN_PERSONA;
                consulta += campo + ' = ?;'
                ing_normal = await query.consulta_sql(consulta, [login.usuario]);
                break;
            default:
                break;
        }
        if (ing_normal.resultado.length > 0) {
            let id_persona = ing_normal.resultado[0].id_persona;
            let contrasenia = ing_normal.resultado[0].contrasenia;
            let intentos = ing_normal.resultado[0].numero_intentos;
            let estado = ing_normal.resultado[0].estado_login;
            if (estado == 1) {
                if (contrasenia != login.contrasenia && (campo == 'correo' || campo == 'telefono' || campo == 'usuario')) {
                    let estado_registro = intentos >= num_max_intentos ? 4 : 3
                    let estado_login = intentos >= num_max_intentos ? 2 : 1
                    intentos++

                    connection.beginTransaction(async err => {
                        if (err) throw err;

                        let error_registro = await query.consulta_sql(sql.SQL_REGISTROS_LOGIN, [id_persona, estado_registro, tipo_login]);
                        if (error_registro.tipo_error != 0)
                            connection.rollback(() => { })
                        error_registro = await query.consulta_sql(sql.SQL_UPDATE_LOGIN_ERROR, [estado_login, intentos, id_persona]);
                        if (error_registro.tipo_error != 0)
                            connection.rollback(() => { })
                        connection.commit(() => { })
                    });
                    respuesta.mensaje = config.MSG_PASS_INCORRECTA;
                    respuesta.tipo_error = config.COD_PASS_INCORRECTA;
                }
                else {
                    await query.consulta_sql(sql.SQL_REGISTROS_LOGIN, [id_persona, 1, tipo_login]);
                }
            }
            else {
                respuesta.mensaje = config.MSG_LOGIN_BLOQUEADO;
                respuesta.tipo_error = config.COD_LOGIN_BLOQUEADO
            }
        }
        else {
            respuesta.mensaje = config.MSG_PASS_INCORRECTA;
            respuesta.tipo_error = config.COD_PASS_INCORRECTA;
        }

    }
    catch (error) {
        throw error;
    }
    return respuesta;
}


// validar login del administrador

const validar_login_admin = async (login) => {
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };

    let num_max_intentos = 3;
    let tipo_login = 3; // admin
    //login 1 : EXITOSO \n 2 : BLOQUEADO POR SUPERAR EL NUMERO DE INTENTO PERMITIDOS \n 3: BLOQUEADO
    //logs 1 : EXITOSO \n 2 : USUARIO INCORRECTO\n3 : CONTRASENIA INCORRECTA\n4 : BLOQUEADO POR SUPERAR EL NUMERO DE INTENTO PERMITIDOS

    try {
        respuesta = await query.consulta_sql(sql.SQL_VALIGAR_LOGIN_ADMIN, [login.usuario]);
        if (respuesta.resultado[0]) {
            let admin = respuesta.resultado[0];

            switch (admin.estado) {
                case 1: //Exito
                    if (admin.contrasenia !== login.contrasenia) {

                        respuesta.mensaje = config.MSG_PASS_INCORRECTA;
                        respuesta.tipo_error = config.COD_PASS_INCORRECTA;

                        let estado_registro = admin.intentos >= num_max_intentos ? 4 : 3
                        let estado_login = admin.intentos >= num_max_intentos ? 2 : 1
                        admin.intentos++

                        connection.beginTransaction(async err => {
                            if (err) throw err;

                            let error_registro = await query.consulta_sql(sql.SQL_REGISTROS_LOGIN, [admin.id_persona, estado_registro, tipo_login]);
                            if (error_registro.tipo_error != 0)
                                connection.rollback(() => { })

                            error_registro = await query.consulta_sql(sql.SQL_UPD_LOGIN_ERR_ADMIN, [estado_login, admin.intentos, login.usuario, admin.id_persona]);

                            if (error_registro.tipo_error != 0)
                                connection.rollback(() => { })

                            connection.commit(() => { })
                        });
                        //registrar log
                    }
                    else {
                        await query.consulta_sql(sql.SQL_REGISTROS_LOGIN, [admin.id_persona, 1, tipo_login]);
                    }
                    break;
                case 2://Supero el numero de intentos, bloqueado
                case 3://Bloqueado
                    respuesta.mensaje = config.MSG_LOGIN_BLOQUEADO;
                    respuesta.tipo_error = config.COD_LOGIN_BLOQUEADO
                    break;
                default:
                    break;
            }
        }
        else {
            respuesta.mensaje = config.MSG_PASS_INCORRECTA;
            respuesta.tipo_error = config.COD_PASS_INCORRECTA;
            //registrar log
        }
    }
    catch (err) {
        throw err;
    }
    return respuesta;
}

// validar si ya registro
// cuestionario, curso, horario, tarifas, etc...
const validar_info_ninera = async (login) => {

}

const registrar_horario = async (horario) => {
    let respuesta = { mensaje: '', tipo_error: 0, resultado: null };
    try {
        respuesta = await query.consulta_sql(sql.SQL_EXISTE_LOGIN_NINERA, [horario.id_persona]);
        if (respuesta.resultado[0].existe == 1) {
            await connection.beginTransaction(async err => {});
            for (let i = 0; i < horario.disponible.length; i++) 
            {
                let horas = horario.disponible[i];
                let val_dia = await query.consulta_sql(sql.SQL_VAL_EXISTE_DIA_HORARIO, [horario.id_persona, horas.dia]);
                if (val_dia.tipo_error == 0) 
                {
                    if (val_dia.resultado[0]) 
                    {
                        connection.rollback(() => { });
                        respuesta.mensaje = "El día ya fue registrado";
                        respuesta.tipo_error = 1;
                        break;
                    }
                }
                let registrar = await query.consulta_sql(sql.SQL_REGISTRAR_HORARIO, [horario.id_persona, horas.hora_inicia, horas.hora_finaliza, horas.dia]);
                if (registrar.tipo_error == 3) 
                {
                    connection.rollback(() => { });
                    respuesta.mensaje = "Error en creación de horario";
                    respuesta.tipo_error = 1;
                    break;
                }
            }
            if (respuesta.tipo_error == 0) 
            {
                connection.commit(() => { });
            }
        }
        else {
            respuesta.mensaje = "La persona no existe"
            respuesta.tipo_error = 1;
        }
    }
    catch (error) {
        throw error;
    }
    return respuesta;
}

module.exports =
{
    registrar_persona,
    obtener_preguntas,
    registrar_preguntas,
    validar_login,
    validar_login_admin,
    registrar_horario
}
