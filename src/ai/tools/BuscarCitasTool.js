import { supabase } from "../../services/supabase";

export async function buscarCitasAlumno(
    alumnoId
) {

    if (!alumnoId) {

        return [];

    }

    const {

        data,
        error

    } = await supabase

        .from("citas_programadas")

        .select(`

            id,

            alumno_id,

            fecha,

            hora,

            tipo,

            motivo,

            observaciones,

            estado,

            created_at,

            cumplida

        `)

        .eq(
            "alumno_id",
            alumnoId
        )

        .order(
            "fecha",
            {
                ascending: true
            }
        )

        .limit(50);

    if (error) {

        console.error(
            "Error buscando citas:",
            error
        );

        throw new Error(
            "No se pudieron recuperar las citas del alumno."
        );

    }

    return data || [];

}