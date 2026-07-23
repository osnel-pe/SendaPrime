import { supabase } from "./supabaseService.ts";

export async function buscarExpediente(

    alumnoId: number

){

    if(!alumnoId){

        return [];

    }

    const { data,error } = await supabase

        .from("expedientes")

        .select("*")

        .eq("alumno_id",alumnoId);

    if(error){

        return [];

    }

    return data ?? [];

}