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

            .eq(
                "id",
                alumnoId
            )

            .maybeSingle();

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

            data.id,

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

    const palabras =
        texto

            .split(" ")

            .filter(

                palabra =>
                    palabra.length >= 3

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

        const palabrasNombre =
            nombreCompleto.split(" ");

        let puntaje = 0;

        for (

            const palabraNombre
            of palabrasNombre

        ) {

            if (

                palabras.includes(
                    palabraNombre
                )

            ) {

                puntaje += 10;

            }

        }

        if (

            texto.includes(
                nombreCompleto
            )

        ) {

            puntaje += 100;

        }

        if (puntaje > 0) {

            candidatos.push({

                alumno,

                puntaje

            });

        }

    }

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

                c =>
                    c.puntaje

            )

        );

    const mejoresCoincidencias =
        candidatos

            .filter(

                c =>
                    c.puntaje ===
                    mejorPuntaje

            )

            .map(

                c =>
                    c.alumno

            );

    if (

        mejoresCoincidencias.length === 1

    ) {

        const alumno =
            mejoresCoincidencias[0];

        guardarCache(

            alumno.id,

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