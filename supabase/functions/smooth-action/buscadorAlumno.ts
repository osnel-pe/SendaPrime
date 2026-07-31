import { buscarAlumno } from "./buscarAlumno.ts";

import type {

    Alumno

} from "./types.ts";


export type ResultadoBusqueda = {

    tipo:

        | "ninguno"

        | "unico"

        | "varios";

    alumno?: Alumno;

    alumnos?: Alumno[];

};


export async function buscarAlumnoUnificado(

    mensaje: string,

    alumnoId?: string | null

): Promise<ResultadoBusqueda> {


    /*
     * BUSCAR POR ID
     */

    if (

        alumnoId

    ) {

        const resultado =

            await buscarAlumno({

                alumnoId

            });

        if (

            resultado.estado === "unico"

        ) {

            return {

                tipo: "unico",

                alumno:

                    resultado.alumno as Alumno

            };

        }

    }


    /*
     * BUSCAR POR TEXTO
     */

    const resultado =

        await buscarAlumno({

            mensaje

        });


    if (

        resultado.estado === "unico"

    ) {

        return {

            tipo: "unico",

            alumno:

                resultado.alumno as Alumno

        };

    }


    if (

        resultado.estado === "varios"

    ) {

        return {

            tipo: "varios",

            alumnos:

                resultado.alumnos as Alumno[]

        };

    }


    return {

        tipo: "ninguno"

    };

}