var { Router } = require('express');
var router = Router();

const login = require('../Controllers/c_login_registro');

// LOGIN    
router.post('/validar_login', login.validar_login);


// REGISTRO
router.post('/registrar-persona', login.registrar_persona);

//CUESTIONARIO
router.post('/obtener-cuestionario', login.obtener_preguntas);
router.post('/registrar-cuestionario', login.registrar_cuestionario);

module.exports = router;