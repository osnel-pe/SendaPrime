import { supabase } from "./supabaseService.ts";
import { LIMITS } from "./constants.ts";

export async function buscarNotas(
    alumnoId: number
) {

    if (!alumnoId) {

        return [];

    }

    const { data, error } = await supabase

        .from("notas_psicologia")

        .select("*")

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

        .limit(
            LIMITS.NOTAS
        );

    if (error) {

        throw error;

    }

    return data ?? [];

}