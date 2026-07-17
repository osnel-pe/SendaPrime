// ======================================
// ShareStorage.js
// Almacena temporalmente el archivo
// compartido por Android.
// ======================================

let archivoCompartido = null;

export function guardarArchivo(file) {

    archivoCompartido = file;

}

export function obtenerArchivo() {

    return archivoCompartido;

}

export function limpiarArchivo() {

    archivoCompartido = null;

}

export function hayArchivo() {

    return archivoCompartido !== null;

}