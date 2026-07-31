import type { Alumno } from "./types.ts";

import {

    seleccionarAlumnoPorTexto

} from "./seleccionAlumno.ts";


export function resolverSeleccionPendiente(

    mensaje: string,

    alumnosPendientes: Alumno[] | null

): Alumno | null {


    if (

        !Array.isArray(alumnosPendientes)

    ) {

        return null;

    }


    if (

        alumnosPendientes.length === 0

    ) {

        return null;

    }


    const alumno =

        seleccionarAlumnoPorTexto(

            alumnosPendientes,

            mensaje

        );


    if (

        alumno

    ) {

        return alumno;

    }


    return null;

}