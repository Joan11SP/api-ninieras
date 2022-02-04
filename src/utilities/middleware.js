const config = require('../config');

const validarDatosEntrada = async (req,res,next) => {

    var auth = new Buffer.from(req.headers.authorization.split(' ')[1],'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    
    if(!user || !pass){
        res.status(400).json({ ok:0, mensaje:'Faltan credenciales'});        
    }
    else{
        try {
               
        } catch (error) {
            console.log(error);
            res.status(500).json({ok:0,mensaje:config.msg_error})
        }
    }
}

const enviarDatos = (req,res) => {
    res.send(req.body);

}

module.exports = {
    validarDatosEntrada,
    enviarDatos
}