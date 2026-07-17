// ======================================
// ShareEvents.js
// Sistema de eventos para avisar cuando
// llega un documento compartido.
// ======================================

const NOMBRE_EVENTO = "senda-expediente-recibido";

export function emitirArchivoCompartido() {

    window.dispatchEvent(

        new CustomEvent(NOMBRE_EVENTO)

    );

}

export function escucharArchivoCompartido(callback) {

    window.addEventListener(

        NOMBRE_EVENTO,

        callback

    );

}

export function dejarDeEscucharArchivoCompartido(callback) {

    window.removeEventListener(

        NOMBRE_EVENTO,

        callback

    );

}