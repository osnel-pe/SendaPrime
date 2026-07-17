// ======================================
// ShareManager.js
// Gestiona la recepción de archivos
// compartidos desde Android.
// ======================================

import {

    guardarArchivo

} from "./ShareStorage";

import {

    emitirArchivoCompartido

} from "./ShareEvents";

let iniciado = false;

export function iniciarShareManager() {

    if (iniciado) return;

    iniciado = true;

    if (!("launchQueue" in window)) {

        console.log("Launch Queue no disponible.");

        return;

    }

    console.log("ShareManager iniciado.");

    window.launchQueue.setConsumer(

        async (launchParams) => {

            if (!launchParams.files.length) return;

            const archivo = await launchParams.files[0].getFile();

            console.log("Archivo recibido:");

            console.log(archivo);

            guardarArchivo(archivo);

            emitirArchivoCompartido();

        }

    );

}