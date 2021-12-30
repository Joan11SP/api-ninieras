var { Router } = require('express');
var router = Router();

const login = require('../Controllers/c_login_registro');

// LOGIN    
router.post('/validar_login', login.validar_login);


// REGISTRO
router.post('/registrar-persona', login.registrar_persona);


module.exports = router;