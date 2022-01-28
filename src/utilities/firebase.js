
const admin = require("firebase-admin");
const serviceAccount = require("./fb-ninieras-notificacion.json");

let json = serviceAccount;


admin.initializeApp({
    credential: admin.credential.cert(json)
});

// Método para enviar notificaciones por medio del servicio de Firebase
const enviar_notificacion_fcm = async (titulo, body, token) => {
    const message_notification = 
    {
        notification: 
        {
            title: titulo,
            body: body
        },
        data:
        {
            pantalla:''
        }
    };
    const notification_options = 
    {
        priority: "high",
        timeToLive: 60 * 60 * 24,
        sound:'default'
    };
    try 
    {
        let error = 1
        await admin.messaging().sendToDevice(token, message_notification, notification_options)
            .then(async (res) =>{
                
                if(res.failureCount == 1 || res.failureCount > 1)
                {
                    let data = 
                    {
                        medio:'firebase',
                        titulo:titulo,
                        mensaje:body,
                        tokens_fmc:token,
                        pantalla:pantalla,
                        error: res.results
                    }                    
                    //await noti_error.crear_notificacion_error(data);
                    error = 0;
                }
            });
        return {ok:error};
    } 
    catch (error) 
    {
        return {ok:0}
    }
}

const enviar_notificacion_fmc_error = async (data) => {
    const message_notification = {
        notification: {
            title: data.titulo,
            body: data.mensaje
        },
        data:{
            pantalla:data.pantalla
        }
    };
    const notification_options = {
        priority: "high",
        timeToLive: 60 * 60 * 24,
        sound:'default'
    };
    try {
        let error = 1
        await admin.messaging().sendToDevice(data.tokens_fmc, message_notification, notification_options)
            .then(async (res) =>{                
                if(res.failureCount >=1){
                    error = 0;
                }
            });
        return {ok:error};
    } catch (error) {
        return {ok:0}
    }
}
module.exports = 
{
    enviar_notificacion_fcm
}