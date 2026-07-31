import { supabase } from "./supabaseService.ts";

import {
    leerCache,
    guardarCache
} from "./cache.ts";


function normalizarTexto(
    texto: string
): string {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();

}


export async function buscarAlumno({

    alumnoId,

    mensaje

}: {

    alumnoId?: string;

    mensaje?: string;

}) {

    console.log("🔥 BUSCAR ALUMNO SE ESTÁ EJECUTANDO");


    /*
     * BÚSQUEDA DIRECTA POR ID
     */

    if (alumnoId) {

        const cache =
            leerCache(alumnoId);

        if (cache) {

            return {

                estado:
                    "unico",

                alumno:
                    cache

            };

        }


        const {
            data,
            error
        } = await supabase
            .from("alumnos")
            .select("*")
            .eq("id", alumnoId)
            .maybeSingle();

        console.log("TOTAL ALUMNOS:", data);


        if (error) {

            throw error;

        }


        if (!data) {

            return {

                estado:
                    "ninguno"

            };

        }


        guardarCache(

            String(data.id),

            data

        );


        return {

            estado:
                "unico",

            alumno:
                data

        };

    }


    if (!mensaje) {

        return {

            estado:
                "ninguno"

        };

    }


    const {
        data,
        error
    } = await supabase
        .from("alumnos")
        .select("*");

    console.log(
        "TOTAL ALUMNOS:",
        data?.length
    );

    console.log(
        "PRIMEROS ALUMNOS:",
        data?.slice(0,3)
    );


    if (error) {

        throw error;

    }


    if (!data || data.length === 0) {

        return {

            estado:
                "ninguno"

        };

    }


    const texto =
        normalizarTexto(mensaje);


    console.log(
        "MENSAJE NORMALIZADO:",
        texto
    );


    const candidatos = [];


    for (const alumno of data) {


        const nombreCompleto =

            normalizarTexto(

                [

                    alumno.nombre,

                    alumno.apellido_paterno,

                    alumno.apellido_materno

                ]

                    .filter(Boolean)

                    .join(" ")

            );


        const nombre =
            normalizarTexto(
                alumno.nombre
            );


        const apellidoPaterno =
            normalizarTexto(
                alumno.apellido_paterno ?? ""
            );


        const apellidoMaterno =
            normalizarTexto(
                alumno.apellido_materno ?? ""
            );


        let puntaje = 0;


        /*
         * NOMBRE EXACTO
         */

        if (

            nombre.length >= 3 &&

            texto.includes(nombre)

        ) {

            puntaje += 100;

        }


        /*
         * APELLIDO PATERNO
         */

        if (

            apellidoPaterno.length >= 3 &&

            texto.includes(apellidoPaterno)

        ) {

            puntaje += 50;

        }


        /*
         * APELLIDO MATERNO
         */

        if (

            apellidoMaterno.length >= 3 &&

            texto.includes(apellidoMaterno)

        ) {

            puntaje += 50;

        }


        /*
         * NOMBRE COMPLETO
         */

        if (

            texto.includes(nombreCompleto)

        ) {

            puntaje += 200;

        }


        if (puntaje > 0) {

            candidatos.push({

                alumno,

                puntaje

            });

        }

    }


    console.log(

        "CANDIDATOS ENCONTRADOS:",

        candidatos.map(

            candidato =>

                candidato.alumno.nombre

        )

    );


    if (

        candidatos.length === 0

    ) {

        return {

            estado:
                "ninguno"

        };

    }


    const mejorPuntaje =

        Math.max(

            ...candidatos.map(

                candidato =>

                    candidato.puntaje

            )

        );


    const mejoresCoincidencias =

        candidatos

            .filter(

                candidato =>

                    candidato.puntaje ===

                    mejorPuntaje

            )

            .map(

                candidato =>

                    candidato.alumno

            );


    if (

        mejoresCoincidencias.length === 1

    ) {


        const alumno =

            mejoresCoincidencias[0];


        guardarCache(

            String(alumno.id),

            alumno

        );


        return {

            estado:
                "unico",

            alumno

        };

    }


    return {

        estado:
            "varios",

        alumnos:

            mejoresCoincidencias

    };

}