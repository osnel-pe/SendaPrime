import { supabase } from "../../services/supabase";

export async function buscarAlumnos(texto) {

    if (!texto || !texto.trim()) {

        return {

            estado: "ninguno",

            alumnos: []

        };

    }

    const termino =
        texto.trim().toLowerCase();

    const palabras =
        termino.split(/\s+/);

    const { data, error } =
        await supabase

            .from("alumnos")

            .select(`

                id,

                nombre,

                apellido_paterno,

                apellido_materno,

                grupo

            `);

    if (error) {

        console.error(
            "Error buscando alumnos:",
            error
        );

        throw error;

    }

    const alumnosEncontrados =
        (data || []).filter(alumno => {

            const nombreCompleto = [

                alumno.nombre,

                alumno.apellido_paterno,

                alumno.apellido_materno

            ]

                .filter(Boolean)

                .join(" ")

                .toLowerCase();

            return palabras.every(

                palabra =>
                    nombreCompleto.includes(palabra)

            );

        });

    if (
        alumnosEncontrados.length === 0
    ) {

        return {

            estado: "ninguno",

            alumnos: []

        };

    }

    if (
        alumnosEncontrados.length === 1
    ) {

        return {

            estado: "unico",

            alumno:
                alumnosEncontrados[0],

            alumnos:
                alumnosEncontrados

        };

    }

    return {

        estado: "varios",

        alumnos:
            alumnosEncontrados

    };

}