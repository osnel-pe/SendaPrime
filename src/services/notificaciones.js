export async function pedirPermiso(){

    if(!("Notification" in window)){

        return false;

    }

    if(Notification.permission==="granted"){

        return true;

    }

    const permiso=await Notification.requestPermission();

    return permiso==="granted";

}

export function mostrarNotificacion(titulo,mensaje){

    if(Notification.permission!=="granted"){

        return;

    }

    new Notification(titulo,{

        body:mensaje,

        icon:"/icon-192.png",

        badge:"/icon-192.png",

        tag:"cita-psicologia"

    });

}