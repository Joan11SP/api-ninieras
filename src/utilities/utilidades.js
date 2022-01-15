const multer = require("multer");
const uuid = require("uuid").v4;
const path = require('path')

let regex_correo = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const validar_correo = (correo) =>
{
    let validado = false;

    if(regex_correo.test(correo))
        validado = true;
    console.log(validado);
    return validado;
}

const respuesta_error = (error) =>
{
    let respuesta = 
    { 
        mensaje: 'Ocurrió un error vuelve a intentarlo', 
        tipo_error: 1,
        resultado: null 
    };
    console.log(error);
    // guardar error que se produjo

    return respuesta;

}

const validar_cedula = (dni) => {
    var total = 0;
    var longitud = dni.length;
    var longcheck = longitud - 1;
    let i = 0;
    let valida = false; // cedula valida
    if (dni !== "" && longitud === 10) {
        for (i; i < longcheck; i++) {
            if (i % 2 === 0) {
                var aux = dni.charAt(i) * 2;
                if (aux > 9) aux -= 9;
                total += aux;
            } else {
                total += parseInt(dni.charAt(i)); // parseInt o concatenará en lugar de sumar
            }
        }

        total = total % 10 ? 10 - total % 10 : 0;

        if (dni.charAt(longitud - 1) == total) 
            valida = true;
    }
    return valida;

}


const storage = multer.diskStorage({
    //destination: null,//path.join(__dirname, '../public/static/images'),
    filename: (req, file, cb) => {
        cb(null, uuid() +  path.extname(file.originalname).toLocaleLowerCase())
    }
});

const upload = multer(
    {
        storage,
        fileFilter: (req, file, cb) => 
        {
            const typesFile = /jpeg|png|jpg/
            const extname = typesFile.test(file.mimetype)
            const names = typesFile.test(path.extname(file.originalname).toLocaleLowerCase());
            if (names && extname) 
                return cb(null, true)
            else 
                return false;            
        }
    }
).single('imagen')




module.exports = 
{
    validar_correo,
    respuesta_error,
    validar_cedula,
    upload
}