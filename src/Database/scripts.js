const config = require("../config")

module.exports =
{
    SQL_REGISTRAR_PERSONA: "insert into "+config.NAME_DB+".persona (nombres, apellidos, nombre_completo, sexo, correo, telefono, identificacion, fecha_nacimiento) values (?,?,?,?,?,?,?,?);",
    SQL_REGISTRAR_LOGIN_CLI_NI:"insert into "+config.NAME_DB+".[tabla] (id_persona, usuario, contrasenia,token_facebook, token_google, imei_dispositivo,token_huella_habilitado, token_firebase, numero_intentos, estado_login) VALUES (?,?,?,?,?,?,?,?,?,?);",
    SQL_EXISTE_PERSONA:"select 1 existe, id_persona from "+config.NAME_DB+".persona where correo = ? or telefono = ? or identificacion = ?;",
    SQL_EXISTE_LOGIN_CLIENTE:"select count(*) existe from "+config.NAME_DB+".login_cliente where id_persona = ?;",
    SQL_EXISTE_LOGIN_NINERA:"select count(*) existe from "+config.NAME_DB+".login_niniera where id_persona = ?;",
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
    SQL_GET_FOTO_PERFIL: "select foto from "+config.NAME_DB+".persona where id_persona = ?;",
    SQL_VAL_EXISTE_SOL_SERVICIO:"select count(*) existe from  "+config.NAME_DB+".solicitud_servicio where id_persona = ? and estado in(1,2);",
    SQL_ADD_SOL_SERVICIO: "insert into "+config.NAME_DB+".solicitud_servicio (id_persona, id_ubicacion, hora_entrada, hora_salida, dia_inicia, dia_fin, numero_dias, codigo_dactilar, identificacion,permite_uso_wifi, descripcion,total_horas, estado) values (?,?,?,?,?,?,?,?,?,?,?,?,1);",
    SQL_ADD_PERS_ANIMAL_CUIDADO:"insert into "+config.NAME_DB+".persona_animal_cuidado (id_persona,nombres,edad,sexo,capacidad_diferente,info_adicional,es_persona_o_animal) values (?,?,?,?,?,?,?);",
    SQL_ADD_DETALLE_CIUDAD_SERVICIO:"insert into "+config.NAME_DB+".detalle_cuidado_servicio (id_solicitud_servicio, id_cuidados) values(?,?);",
    SQL_VAL_EXISTE_CUIDAD: "select count(*) existe from "+config.NAME_DB+".persona_animal_cuidado where id_cuidados = ? and id_persona = ?;",
    SQL_GET_ONE_SERVICIOS: "select s.id_ubicacion,nombres, ifnull(foto,'SF') foto, hora_entrada, hora_salida, numero_dias, total_horas,date_format(dia_inicia,'%Y-%m-%d') dia_inicia, date_format(dia_fin,'%Y-%m-%d') dia_fin, cast(permite_uso_wifi=1 as signed integer) permite_uso_wifi, descripcion"
                           + " from "+config.NAME_DB+".persona p, db_ninieras.solicitud_servicio s"
                           + " where p.id_persona = s.id_persona and s.id_solicitud_servicio = ? and s.id_persona = ? and s.estado = ?;",
    SQL_GET_UBI_ONE_SERVICIO: "select latitud, longitud, referencia, calles from "+config.NAME_DB+".ubicacion u, "+config.NAME_DB+".solicitud_servicio s"
                                +" where s.id_ubicacion = u.id_ubicacion and s.id_persona = u.id_persona"
                                +" and s.id_solicitud_servicio = ? and s.id_persona = ? and s.id_ubicacion = ? and s.estado = ?;",
    SQL_ADD_UBICACION: "insert into "+config.NAME_DB+".ubicacion (ubicacion_nombre,latitud,longitud,referencia,calles,id_persona) values (?, ?, ?, ?, ?, ?);",
    SQL_GET_CUIDADO_SERVICIO: "select d.id_cuidados, nombres, edad, sexo, cast(capacidad_diferente=1 as signed integer) capacidad_diferente,"
                                +" info_adicional,cast(es_persona_o_animal=1 as signed integer) es_persona_o_animal"
                                +" from db_ninieras.detalle_cuidado_servicio d, db_ninieras.persona_animal_cuidado p"
                                +" where d.id_cuidados = p.id_cuidados and d.id_solicitud_servicio = 1;"

}











