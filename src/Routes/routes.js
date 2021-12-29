var { Router } = require('express');

const login = require('../Controllers/c_login');

// LOGIN    
router.post('/validar_login', login.validar_login);

var router = Router();

module.exports = router;