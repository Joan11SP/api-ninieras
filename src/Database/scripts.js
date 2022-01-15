const config = require("../config")

module.exports =
{
    SQL_REGISTRAR_PERSONA: "insert into "+config.NAME_DB+".persona (nombres, apellidos, nombre_completo, sexo, correo, telefono, identificacion, fecha_nacimiento) values (?,?,?,?,?,?,?,?);",
    SQL_REGISTRAR_LOGIN_CLI_NI:"insert into "+config.NAME_DB+".[tabla] (id_persona, usuario, contrasenia,token_facebook, token_google, imei_dispositivo,token_huella_habilitado, token_firebase, numero_intentos, estado_login) VALUES (?,?,?,?,?,?,?,?,?,?);",
    SQL_EXISTE_PERSONA:"select 1 existe, id_persona from "+config.NAME_DB+".persona where correo = ? or telefono = ? or identificacion = ?;",
    SQL_EXISTE_LOGIN_CLIENTE:"select 1 existe from "+config.NAME_DB+".login_cliente where id_persona = ?;",
    SQL_EXISTE_LOGIN_NINERA:"select 1 existe from "+config.NAME_DB+".login_niniera where id_persona = ?;",
    SQL_PREGUNTAS:"select id_pregunta, pregunta, tipo_pregunta, '' opcion from "+config.NAME_DB+".preguntas where habilitado = 1;",
    SQL_OPCIONES: "select id_opcion, id_pregunta, opcion from "+config.NAME_DB+".opciones where habilitado = 1;",
    SQL_INSTAR_RESPUESTAS: "insert into "+config.NAME_DB+".respuestas (id_pregunta, respuesta, id_persona) values (?,?,?);",
    SQL_EXISTE_RESPUESTAS: "select distinct id_persona as exiteS_respuestas from "+config.NAME_DB+".respuestas where id_persona = ? and habilitado = 1;",
    SQL_VALIDAR_LOGIN_CLI: "select id_persona, usuario, contrasenia, estado_login, numero_intentos from "+config.NAME_DB+".login_cliente where ",
    SQL_VALIDAR_LOGIN_PERSONA: "select p.id_persona, l.contrasenia, l.numero_intentos, l.estado_login from "+config.NAME_DB+".persona p,"+config.NAME_DB+".login_cliente l where	p.id_persona = l.id_persona	and ",
    SQL_REGISTROS_LOGIN: "insert into "+config.NAME_DB+".registro_login (id_persona, estado, tipo_login) values (?,?,?);",
    SQL_UPDATE_LOGIN_ERROR: "update "+config.NAME_DB+".login_cliente set estado_login = ?, numero_intentos = ? where id_persona = ?;",
    SQL_VALIGAR_LOGIN_ADMIN: "select id_login_administrador, id_persona, contrasenia, estado, intentos from "+config.NAME_DB+".login_administrador where usuario = ?;",
    SQL_UPD_LOGIN_ERR_ADMIN: "update "+config.NAME_DB+".login_administrador set estado = ?, intentos = ? where usuario = ? and id_persona = ?;",
    SQL_REGISTRAR_HORARIO: "insert into "+config.NAME_DB+".horario_trabajo (id_persona, hora_inicia, hora_finaliza, dia) values (?,?,?,?);",
    SQL_VAL_EXISTE_DIA_HORARIO: "select 1 existe from "+config.NAME_DB+".horario_trabajo where id_persona = ? and dia = ?;",
    SQL_UPD_FOTO_PERFIL:"update "+config.NAME_DB+".persona set foto = ? where id_persona = ?;",
    SQL_GET_FOTO_PERFIL: "select foto from "+config.NAME_DB+".persona where id_persona = ?;"
}









