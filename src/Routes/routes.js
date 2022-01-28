const router = require('express')();
const utilidad = require('../utilities/utilidades');

const login = require('../Controllers/c_login_registro'),
      persona = require('../Controllers/c_persona'),
      servicio = require('../Controllers/c_servicio');


// LOGIN    
router.post('/validar-login', login.validar_login);
router.post('/validar-login-admin', login.validar_login_admin);


// REGISTRO
router.post('/registrar-persona', login.registrar_persona);
router.post('/obtener-cuestionario', login.obtener_preguntas);
router.post('/registrar-cuestionario', login.registrar_cuestionario);
router.post('/registrar-horario', login.registrar_horario);

//PERSONA
router.post('/resgistrar-foto-perfil', persona.cambiar_foto_perfil);
router.post('/obtener-foto-perfil', persona.obtener_foto_perfil);
router.post('/agregar-cuidado', persona.add_persona_o_animal_cuidado);
router.post('/agregar-ubicacion', persona.add_ubicacion);

//SERVCIO
router.post('/solicitar-servicio', servicio.solicitar_servicio_niniera);
router.post('/obtener-one-servicio', servicio.obtener_one_servicio);
router.post('/proponer-servicio', servicio.add_proponer_servicio);


module.exports = router;