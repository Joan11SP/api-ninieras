const config = require("../config")

module.exports =
{
    SQL_REGISTRAR_PERSONA: "insert into "+config.NAME_DB+".persona (id_tipo_persona, nombres, apellidos, nombre_completo, sexo, correo, telefono, identificacion, fecha_nacimiento) values (?,?,?,?,?,?,?,?,?);",
    SQL_REGISTRAR_LOGIN_CLIENTE:"insert into "+config.NAME_DB+".login_cliente (id_persona, usuario, contrasenia,token_facebook, token_google, imei_dispositivo,token_huella_habilitado, token_firebase, numero_intentos, estado_login, curso_aprobado) VALUES (?,?,?,?,?,?,?,?,?,?,?);",
    SQL_EXISTE_PERSONA:"select 1 existe from "+config.NAME_DB+".persona where correo = ? or telefono = ? or identificacion = ?;",
    SQL_EXISTE_LOGIN_CLIENTE:"select 1 existe from "+config.NAME_DB+".login_cliente where usuario = ?;",
    SQL_PREGUNTAS:"select id_pregunta, pregunta, tipo_pregunta, '' opcion from "+config.NAME_DB+".preguntas where habilitado = 1;",
    SQL_OPCIONES: "select id_opcion, id_pregunta, opcion from "+config.NAME_DB+".opciones where habilitado = 1;",
    SQL_INSTAR_RESPUESTAS: "insert into "+config.NAME_DB+".respuestas (id_pregunta, respuesta, id_persona) values (?,?,?);"
}






