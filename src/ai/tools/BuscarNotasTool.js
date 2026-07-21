import { supabase } from "../../services/supabase";

export async function buscarNotasAlumno(
    alumnoId
) {

    if (!alumnoId) {

        return [];

    }

    const {

        data,
        error

    } = await supabase

        .from("notas_psicologia")

        .select(`

            id,

            alumno_id,

            titulo,

            nota,

            created_at,

            grupo,

            color,

            fijada

        `)

        .eq(
            "alumno_id",
            alumnoId
        )

        .order(
            "created_at",
            {
                ascending: false
            }
        )

        .limit(50);

    if (error) {

        console.error(
            "Error buscando notas:",
            error
        );

        throw new Error(
            "No se pudieron recuperar las notas psicológicas."
        );

    }

    return data || [];

}