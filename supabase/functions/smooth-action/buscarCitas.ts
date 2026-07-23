import { supabase } from "./supabaseService.ts";

import { LIMITS } from "./constants.ts";

export async function buscarCitas(

    alumnoId: number

){

    if(!alumnoId){

        return [];

    }

    const { data,error } = await supabase

        .from("citas_programadas")

        .select("*")

        .eq("alumno_id",alumnoId)

        .order(

            "fecha",

            {

                ascending:true

            }

        )

        .limit(LIMITS.CITAS);

    if(error) throw error;

    return data ?? [];

}