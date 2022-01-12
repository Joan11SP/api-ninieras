var { Router } = require('express');
var router = Router();

const login = require('../Controllers/c_login_registro');

// LOGIN    
router.post('/validar-login', login.validar_login);
router.post('/validar-login-admin', login.validar_login_admin);


// REGISTRO
router.post('/registrar-persona', login.registrar_persona);

//CUESTIONARIO
router.post('/obtener-cuestionario', login.obtener_preguntas);
router.post('/registrar-cuestionario', login.registrar_cuestionario);

//HORARIO
router.post('/registrar-horario', login.registrar_horario);

module.exports = router;