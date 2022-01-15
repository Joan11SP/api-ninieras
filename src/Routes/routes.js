var { Router } = require('express');
const utilidad = require('../utilities/utilidades');
var router = Router();

const login = require('../Controllers/c_login_registro');
const persona = require('../Controllers/c_persona')

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


module.exports = router;